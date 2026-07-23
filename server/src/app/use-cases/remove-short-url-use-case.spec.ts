import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import z from 'zod'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isLeft, isRight } from '@/shared/either'
import { createShortUrlUseCase } from './create-short-url-use-case'
import {
  removeShortUrlInput,
  removeShortUrlUseCase,
} from './remove-short-url-use-case'

describe('Remove short url', () => {
  it('should be able to remove an existing shortened url', async () => {
    const slug = randomUUID().split('-')[0]

    const sut = await createShortUrlUseCase({
      unshortenedUrl: 'https://ftr.rocketseat.com.br',
      slug,
    })

    expect(isRight(sut)).toBe(true)

    if (isLeft(sut)) {
      return
    }

    const result = await db
      .select()
      .from(schema.shortenedUrls)
      .where(eq(schema.shortenedUrls.slug, slug))

    expect(result).toHaveLength(1)

    await removeShortUrlUseCase({ slug })

    const result2 = await db
      .select()
      .from(schema.shortenedUrls)
      .where(eq(schema.shortenedUrls.slug, slug))

    expect(result2).toHaveLength(0)
  })

  const slugs = ['invalid@slug', 'url#123', 'foo%20bar']

  it.each(
    slugs
  )('should not be able to remove a shortened url with an invalid slug param: $0', async slug => {
    const parse = removeShortUrlInput.safeParse({ slug })

    expect(parse.success).toBe(false)

    try {
      await removeShortUrlUseCase({ slug })

      expect.fail('Expected function to throw')
    } catch (error) {
      expect(error).toBeInstanceOf(z.ZodError)

      expect(error).toHaveProperty(
        'message',
        expect.stringContaining('The slug contains invalid characters')
      )
    }
  })
})
