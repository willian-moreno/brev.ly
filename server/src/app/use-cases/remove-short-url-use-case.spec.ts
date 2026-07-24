import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import z from 'zod'
import { isLeft, isRight, unwrapEither } from '@/shared/either'
import { createShortUrlUseCase } from './create-short-url-use-case'
import { findUnshortenedUrlUseCase } from './find-unshortened-url-use-case'
import {
  type RemoveShortUrlInput,
  removeShortUrlInput,
  removeShortUrlUseCase,
} from './remove-short-url-use-case'

describe('Remove short url', () => {
  describe('happy path', () => {
    it('should remove an existing short url', async () => {
      const token = randomUUID().split('-')[0]
      const slug = `${token}-unique-slug`

      const created = await createShortUrlUseCase({
        unshortenedUrl: 'https://ftr.rocketseat.com.br',
        slug,
      })

      expect(isRight(created)).toBe(true)

      const beforeRemoval = await findUnshortenedUrlUseCase({ slug })

      expect(isRight(beforeRemoval)).toBe(true)

      const sut = await removeShortUrlUseCase({ slug })

      expect(sut).toBeUndefined()

      const afterRemoval = await findUnshortenedUrlUseCase({ slug })

      expect(isLeft(afterRemoval)).toBe(true)
    })

    it('should not affect other existing short urls when removing one', async () => {
      const slugToRemove = randomUUID().split('-')[0]
      const slugToKeep = randomUUID().split('-')[0]

      await createShortUrlUseCase({
        unshortenedUrl: 'https://ftr.rocketseat.com.br',
        slug: slugToRemove,
      })

      await createShortUrlUseCase({
        unshortenedUrl: 'https://another-url.com',
        slug: slugToKeep,
      })

      await removeShortUrlUseCase({ slug: slugToRemove })

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
        'https://another-url.com'
      )
    })
  })

  describe('non-existent slug', () => {
    it('should resolve silently without throwing when the slug does not exist', async () => {
      const token = randomUUID().split('-')[0]
      const slug = `non-existent-${token}`

      await expect(removeShortUrlUseCase({ slug })).resolves.toBeUndefined()
    })

    it('should be idempotent when called twice for the same slug', async () => {
      const token = randomUUID().split('-')[0]
      const slug = `${token}-unique-slug`

      await createShortUrlUseCase({
        unshortenedUrl: 'https://ftr.rocketseat.com.br',
        slug,
      })

      await removeShortUrlUseCase({ slug })

      await expect(removeShortUrlUseCase({ slug })).resolves.toBeUndefined()
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
    )('should not be able to remove a short url with $description', async ({
      slug,
    }) => {
      const input: RemoveShortUrlInput = { slug }

      const parse = removeShortUrlInput.safeParse(input)

      expect(parse.success).toBe(false)

      await expect(removeShortUrlUseCase(input)).rejects.toBeInstanceOf(
        z.ZodError
      )
    })

    it('should accept a valid slug', () => {
      const token = randomUUID().split('-')[0]
      const slug = `${token}-unique-slug`

      const parse = removeShortUrlInput.safeParse({ slug })

      expect(parse.success).toBe(true)
    })
  })
})
