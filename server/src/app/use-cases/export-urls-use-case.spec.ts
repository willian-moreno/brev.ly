import type { PassThrough } from 'node:stream'
import dayjs from 'dayjs'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { FailureToUploadToStorage } from '@/app/errors/failure-to-upload-to-storage'
import * as upload from '@/infra/storage/upload-file-to-storage'
import { isLeft, isRight, unwrapEither } from '@/shared/either'
import { makeSlug } from '@/test/factories/make-slug'
import { makeUnshortenedUrl } from '@/test/factories/make-unshortened-url'
import { readStreamAsString } from '@/test/factories/read-stream-as-string'
import { createShortUrlUseCase } from './create-short-url-use-case'
import { exportUrlsUseCase } from './export-urls-use-case'
import { findUrlsUseCase } from './find-urls-use-case'

describe('Export urls', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('happy path', () => {
    it('should be able to export urls matching the search', async () => {
      const fileName = `${dayjs().locale('pt-br').format('YYYYMMDDHHmm')}-urls.csv`

      const uploadStub = vi
        .spyOn(upload, 'uploadFileToStorage')
        .mockImplementationOnce(async () => {
          return {
            key: `downloads/${fileName}`,
            url: `https://pub-test.r2.dev/downloads/${fileName}`,
          }
        })

      const unshortenedUrl = makeUnshortenedUrl()
      const slugPattern = makeSlug()

      for (let index = 1; index <= 5; index++) {
        await createShortUrlUseCase({
          unshortenedUrl,
          slug: `${slugPattern}-${index}`,
        })
      }

      const urlsResult = await findUrlsUseCase({
        search: slugPattern,
        sortBy: 'slug',
        sortDirection: 'asc',
      })

      expect(isRight(urlsResult)).toBe(true)

      if (isLeft(urlsResult)) {
        return
      }

      const { items: urlsCreated } = unwrapEither(urlsResult)

      const sut = await exportUrlsUseCase({ search: slugPattern })

      expect(isRight(sut)).toBe(true)

      if (isLeft(sut)) {
        return
      }

      expect(unwrapEither(sut)).toEqual({
        reportUrl: `https://pub-test.r2.dev/downloads/${fileName}`,
      })

      const generatedCSVStream = uploadStub.mock.calls[0][0].contentStream

      const csvAsString = await readStreamAsString(generatedCSVStream)

      const csvAsArray = csvAsString
        .trim()
        .split('\n')
        .map(row => row.split(','))

      expect(csvAsArray).toEqual([
        ['Original URL', 'Short URL', 'Total visits', 'Created at'],
        ...urlsCreated.map(({ unshortenedUrl: url, slug, totalVisits }) => [
          url,
          slug,
          String(totalVisits),
          expect.any(String),
        ]),
      ])
    })

    it('should produce a CSV with only the header row when no url matches the search', async () => {
      const searchTerm = `no-match-${makeSlug()}`
      const fileName = `${dayjs().locale('pt-br').format('YYYYMMDDHHmm')}-urls.csv`

      const uploadStub = vi
        .spyOn(upload, 'uploadFileToStorage')
        .mockImplementationOnce(async () => {
          return {
            key: `downloads/${fileName}`,
            url: `https://pub-test.r2.dev/downloads/${fileName}`,
          }
        })

      const sut = await exportUrlsUseCase({ search: searchTerm })

      expect(isRight(sut)).toBe(true)

      const generatedCSVStream = uploadStub.mock.calls[0][0].contentStream
      const csvAsString = await readStreamAsString(generatedCSVStream)

      const csvAsArray = csvAsString
        .trim()
        .split('\n')
        .map(row => row.split(','))

      expect(csvAsArray).toEqual([
        ['Original URL', 'Short URL', 'Total visits', 'Created at'],
      ])
    })
  })

  describe('storage failure', () => {
    it('should return FailureToUploadToStorage when the upload result does not match the expected shape', async () => {
      vi.spyOn(upload, 'uploadFileToStorage').mockImplementationOnce(
        async ({ contentStream }) => {
          ;(contentStream as PassThrough).resume()
          return {
            key: 'downloads/broken.csv',
            url: 'not-a-valid-url',
          } as unknown as { key: string; url: string }
        }
      )

      const slug = makeSlug()

      const sut = await exportUrlsUseCase({ search: slug })

      expect(isLeft(sut)).toBe(true)

      if (isRight(sut)) {
        return
      }

      const error = unwrapEither(sut)

      expect(error).toBeInstanceOf(FailureToUploadToStorage)
    })
  })

  describe('input validation', () => {
    it('should accept an input without a search term', async () => {
      const fileName = `${dayjs().locale('pt-br').format('YYYYMMDDHHmm')}-urls.csv`

      vi.spyOn(upload, 'uploadFileToStorage').mockImplementationOnce(
        async ({ contentStream }) => {
          ;(contentStream as PassThrough).resume()

          return {
            key: `downloads/${fileName}`,
            url: `https://pub-test.r2.dev/downloads/${fileName}`,
          }
        }
      )

      const sut = await exportUrlsUseCase({})

      expect(isRight(sut)).toBe(true)
    })
  })
})
