import { describe, expect, it } from 'vitest'
import z from 'zod'
import { UrlNotFound } from '@/app/errors/url-not-found'
import { isLeft, isRight, unwrapEither } from '@/shared/either'
import { makeSlug } from '@/test/factories/make-slug'
import { createShortUrlUseCase } from './create-short-url-use-case'
import {
  type FindUnshortenedUrlInput,
  findUnshortenedUrlInput,
  findUnshortenedUrlUseCase,
} from './find-unshortened-url-use-case'

describe('Find unshortened url', () => {
  describe('happy path', () => {
    it('should be able to find the unshortened url for an existing slug', async () => {
      const slug = makeSlug()

      const created = await createShortUrlUseCase({
        unshortenedUrl: 'https://ftr.rocketseat.com.br',
        slug,
      })

      expect(isRight(created)).toBe(true)

      const sut = await findUnshortenedUrlUseCase({ slug })

      expect(isRight(sut)).toBe(true)

      if (isLeft(sut)) {
        return
      }

      const data = unwrapEither(sut)
      const findUnshortenedUrlOutput = z.object({ unshortenedUrl: z.url() })
      const parse = findUnshortenedUrlOutput.safeParse(data)

      expect(parse.success).toBe(true)
      expect(data.unshortenedUrl).toBe('https://ftr.rocketseat.com.br')
    })
  })

  describe('not found', () => {
    it('should not be able to find an unshortened url for a slug that does not exist', async () => {
      const slug = makeSlug()

      const sut = await findUnshortenedUrlUseCase({ slug })

      expect(isLeft(sut)).toBe(true)

      if (isRight(sut)) {
        return
      }

      const error = unwrapEither(sut)

      expect(error).toBeInstanceOf(UrlNotFound)

      expect(error.message).toBe('URL not found')
    })
  })

  describe('input validation', () => {
    const invalidSlugCases: { description: string; slug: string }[] = [
      { description: 'a slug with an @ character', slug: 'invalid@slug' },
      { description: 'a slug with a # character', slug: 'url#123' },
      { description: 'a slug with an encoded space', slug: 'foo%20bar' },
    ]

    it.each(
      invalidSlugCases
    )('should not be able to find an unshortened url with $description', async ({
      slug,
    }) => {
      const input: FindUnshortenedUrlInput = { slug }

      const parse = findUnshortenedUrlInput.safeParse(input)

      expect(parse.success).toBe(false)

      await expect(findUnshortenedUrlUseCase(input)).rejects.toBeInstanceOf(
        z.ZodError
      )
    })

    it('should accept a valid slug', () => {
      const slug = makeSlug()

      const parse = findUnshortenedUrlInput.safeParse({ slug })

      expect(parse.success).toBe(true)
    })
  })
})
