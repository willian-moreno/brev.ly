import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import z from 'zod'
import { UrlAlreadyExists } from '@/app/errors/url-already-exists'
import { isLeft, isRight, unwrapEither } from '@/shared/either'
import {
  type CreateShortUrlInput,
  createShortUrlInput,
  createShortUrlUseCase,
} from './create-short-url-use-case'

describe('Create short url', () => {
  describe('happy path', () => {
    it('should be able to create a short url', async () => {
      const token = randomUUID().split('-')[0]
      const slug = `${token}-unique-slug`

      const sut = await createShortUrlUseCase({
        unshortenedUrl: 'https://ftr.rocketseat.com.br',
        slug,
      })

      expect(isRight(sut)).toBe(true)

      if (isLeft(sut)) {
        return
      }

      const data = unwrapEither(sut)
      const createShortUrlOutput = z.object({ id: z.string() })
      const parse = createShortUrlOutput.safeParse(data)

      expect(parse.success).toBe(true)
    })
  })

  describe('conflict', () => {
    it('should not be able to create a short url with a slug that already exists', async () => {
      const token = randomUUID().split('-')[0]
      const slug = `${token}-unique-slug`

      const first = await createShortUrlUseCase({
        unshortenedUrl: 'https://ftr.rocketseat.com.br',
        slug,
      })

      expect(isRight(first)).toBe(true)

      const second = await createShortUrlUseCase({
        unshortenedUrl: 'https://another-url.com',
        slug,
      })

      expect(isLeft(second)).toBe(true)

      if (isRight(second)) {
        return
      }

      const error = unwrapEither(second)

      expect(error).toBeInstanceOf(UrlAlreadyExists)
    })
  })

  describe('input validation', () => {
    const invalidUrlCases: { description: string; unshortenedUrl: string }[] = [
      {
        description: 'a string with no URL scheme',
        unshortenedUrl: 'not-a-url',
      },
      { description: 'an empty string', unshortenedUrl: '' },
      { description: 'plain text', unshortenedUrl: 'just some text' },
    ]

    it.each(
      invalidUrlCases
    )('should not be able to create a short url with $description as unshortenedUrl', async ({
      unshortenedUrl,
    }) => {
      const token = randomUUID().split('-')[0]
      const slug = `${token}-unique-slug`
      const input: CreateShortUrlInput = { unshortenedUrl, slug }

      const parse = createShortUrlInput.safeParse(input)

      expect(parse.success).toBe(false)

      await expect(createShortUrlUseCase(input)).rejects.toBeInstanceOf(
        z.ZodError
      )
    })

    const invalidSlugCases: { description: string; slug: string }[] = [
      { description: 'a slug with an @ character', slug: 'invalid@slug' },
      { description: 'a slug with a # character', slug: 'url#123' },
      { description: 'a slug with an encoded space', slug: 'foo%20bar' },
    ]

    it.each(
      invalidSlugCases
    )('should not be able to create a short url with $description', async ({
      slug,
    }) => {
      const input: CreateShortUrlInput = {
        unshortenedUrl: 'https://ftr.rocketseat.com.br',
        slug,
      }

      const parse = createShortUrlInput.safeParse(input)

      expect(parse.success).toBe(false)

      await expect(createShortUrlUseCase(input)).rejects.toBeInstanceOf(
        z.ZodError
      )
    })

    it('should accept a valid input', () => {
      const token = randomUUID().split('-')[0]
      const slug = `${token}-unique-slug`

      const parse = createShortUrlInput.safeParse({
        unshortenedUrl: 'https://ftr.rocketseat.com.br',
        slug,
      })

      expect(parse.success).toBe(true)
    })
  })
})
