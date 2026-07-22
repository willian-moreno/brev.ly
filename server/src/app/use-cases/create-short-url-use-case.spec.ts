import { randomUUID } from 'node:crypto'
import { DrizzleQueryError, eq } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import z from 'zod'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isLeft, isRight } from '@/shared/either'
import { ShortenedUrlAlreadyExists } from '../errors/shortened-url-already-exists'
import {
  createShortUrlInput,
  createShortUrlUseCase,
} from './create-short-url-use-case'

describe('create short url', () => {
  it('should be able to create a short url', async () => {
    const unshortenedUrl = 'https://ftr.rocketseat.com.br'
    const slug = randomUUID().split('-')[0]

    const sut = await createShortUrlUseCase({
      unshortenedUrl,
      slug,
    })

    expect(isRight(sut)).toBe(true)

    const result = await db
      .select()
      .from(schema.shortenedUrls)
      .where(eq(schema.shortenedUrls.slug, slug))

    expect(result).toHaveLength(1)
  })

  it('should not be able to create a short url on invalid params', async () => {
    const unshortenedUrl = 'ftr.rocketseat'
    const slug = 'inv@l1d valu3'

    const parse = createShortUrlInput.safeParse({ unshortenedUrl, slug })

    expect(parse.success).toBe(false)

    expect(parse.error?.issues[0].message).toBe(
      'The url contains invalid characters'
    )

    expect(parse.error?.issues[1].message).toBe(
      'The slug contains invalid characters'
    )

    expect(() =>
      createShortUrlUseCase({
        unshortenedUrl,
        slug,
      })
    ).rejects.toThrow(z.ZodError)

    const result = await db
      .select()
      .from(schema.shortenedUrls)
      .where(eq(schema.shortenedUrls.slug, slug))

    expect(result).toHaveLength(0)
  })

  it('should not be able to create a short url if one already exists', async () => {
    const unshortenedUrl = 'https://ftr.rocketseat.com.br'
    const slug = randomUUID().split('-')[0]

    const sut = await createShortUrlUseCase({
      unshortenedUrl,
      slug,
    })

    expect(isRight(sut)).toBe(true)

    const result = await db
      .select()
      .from(schema.shortenedUrls)
      .where(eq(schema.shortenedUrls.slug, slug))

    expect(result).toHaveLength(1)

    const sut2 = await createShortUrlUseCase({
      unshortenedUrl,
      slug,
    })

    expect(isLeft(sut2)).toBe(true)

    if (isLeft(sut2)) {
      expect(sut2.left).toBeInstanceOf(ShortenedUrlAlreadyExists)
      expect(sut2.left.message).toBe('Shortened url already exists')
    }

    expect(() =>
      db.insert(schema.shortenedUrls).values({
        unshortenedUrl,
        slug,
      })
    ).rejects.toThrow(DrizzleQueryError)
  })
})
