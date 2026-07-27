import { describe, expect, it } from 'vitest'
import z from 'zod'
import { UrlNotFound } from '@/app/errors/url-not-found'
import { isLeft, isRight, unwrapEither } from '@/shared/either'
import { makeSlug } from '@/test/factories/make-slug'
import { makeUnshortenedUrl } from '@/test/factories/make-unshortened-url'
import { createShortUrlUseCase } from './create-short-url-use-case'
import { findUnshortenedUrlUseCase } from './find-unshortened-url-use-case'
import {
  type RemoveUrlInput,
  removeUrlInput,
  removeUrlUseCase,
} from './remove-url-use-case'

describe('Remove url', () => {
  describe('happy path', () => {
    it('should remove an existing url', async () => {
      const slug = makeSlug()

      const created = await createShortUrlUseCase({
        unshortenedUrl: makeUnshortenedUrl(),
        slug,
      })

      expect(isRight(created)).toBe(true)

      const beforeRemoval = await findUnshortenedUrlUseCase({ slug })

      expect(isRight(beforeRemoval)).toBe(true)

      const sut = await removeUrlUseCase({ slug })

      expect(isRight(sut)).toBe(true)

      if (isLeft(sut)) {
        return
      }

      expect(unwrapEither(sut)).toBeTruthy()

      const afterRemoval = await findUnshortenedUrlUseCase({ slug })

      expect(isLeft(afterRemoval)).toBe(true)
    })

    it('should not affect other existing urls when removing one', async () => {
      const unshortenedUrl = makeUnshortenedUrl()
      const anotherUnshortenedUrl = makeUnshortenedUrl()
      const slug = makeSlug()
      const slugToRemove = `${slug}-1`
      const slugToKeep = `${slug}-2`

      await createShortUrlUseCase({
        unshortenedUrl,
        slug: slugToRemove,
      })

      await createShortUrlUseCase({
        unshortenedUrl: anotherUnshortenedUrl,
        slug: slugToKeep,
      })

      const sut = await removeUrlUseCase({ slug: slugToRemove })

      expect(isRight(sut)).toBe(true)

      const removedLookup = await findUnshortenedUrlUseCase({
        slug: slugToRemove,
      })

      const keptLookup = await findUnshortenedUrlUseCase({ slug: slugToKeep })

      expect(isLeft(removedLookup)).toBe(true)
      expect(isRight(keptLookup)).toBe(true)

      if (isLeft(keptLookup)) {
        return
      }

      expect(unwrapEither(keptLookup).unshortenedUrl).toBe(
        anotherUnshortenedUrl
      )
    })
  })

  describe('not found', () => {
    it('should not be able to remove an url that does not exist', async () => {
      const slug = makeSlug()

      const sut = await removeUrlUseCase({ slug })

      expect(isLeft(sut)).toBe(true)

      if (isRight(sut)) {
        return
      }

      const error = unwrapEither(sut)

      expect(error).toBeInstanceOf(UrlNotFound)
      expect(error.message).toBe('URL not found')
    })

    it('should not be able to remove the same url twice', async () => {
      const slug = makeSlug()

      await createShortUrlUseCase({
        unshortenedUrl: makeUnshortenedUrl(),
        slug,
      })

      const first = await removeUrlUseCase({ slug })

      expect(isRight(first)).toBe(true)

      const second = await removeUrlUseCase({ slug })

      expect(isLeft(second)).toBe(true)

      if (isRight(second)) {
        return
      }

      expect(unwrapEither(second)).toBeInstanceOf(UrlNotFound)
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
    )('should not be able to remove an url with $description', async ({
      slug,
    }) => {
      const input: RemoveUrlInput = { slug }

      const parse = removeUrlInput.safeParse(input)

      expect(parse.success).toBe(false)

      await expect(removeUrlUseCase(input)).rejects.toBeInstanceOf(z.ZodError)
    })

    it('should accept a valid slug', () => {
      const slug = makeSlug()

      const parse = removeUrlInput.safeParse({ slug })

      expect(parse.success).toBe(true)
    })
  })
})
