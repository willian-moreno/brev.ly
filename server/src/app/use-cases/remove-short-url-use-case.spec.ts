import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { uuidv7 } from 'uuidv7'
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
    const sut = await createShortUrlUseCase({
      unshortenedUrl: 'https://ftr.rocketseat.com.br',
      slug: randomUUID().split('-')[0],
    })

    expect(isRight(sut)).toBe(true)

    if (isLeft(sut)) {
      return
    }

    const id = sut.right.id

    const result = await db
      .select()
      .from(schema.shortenedUrls)
      .where(eq(schema.shortenedUrls.id, id))

    expect(result).toHaveLength(1)

    await removeShortUrlUseCase({ id })

    const result2 = await db
      .select()
      .from(schema.shortenedUrls)
      .where(eq(schema.shortenedUrls.id, id))

    expect(result2).toHaveLength(0)
  })

  const invalidIds = [
    'invalid-value',
    uuidv7().split('-').slice(0, -1).join('-'),
  ]

  it.each(
    invalidIds
  )('should not be able to remove a shortened url with an invalid id param: $0', async id => {
    const parse = removeShortUrlInput.safeParse({ id })

    expect(parse.success).toBe(false)

    expect(parse.error?.issues[0].message).toBe('The id format is invalid')

    expect(() => removeShortUrlUseCase({ id })).rejects.toThrow(z.ZodError)
  })
})
