import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import z from 'zod'
import { isLeft, isRight, unwrapEither } from '@/shared/either'
import { createShortUrlUseCase } from './create-short-url-use-case'
import {
  increaseUrlVisitInput,
  increaseUrlVisitUseCase,
} from './increase-url-visit-use-case'

describe('Increase url visit', () => {
  it('should be able to correctly increase the total number of visits', async () => {
    const slug = randomUUID().split('-')[0]

    const sut = await createShortUrlUseCase({
      unshortenedUrl: 'https://ftr.rocketseat.com.br',
      slug,
    })

    expect(isRight(sut)).toBe(true)

    for (let index = 1; index <= 5; index++) {
      const sut = await increaseUrlVisitUseCase({ slug })

      expect(isRight(sut)).toBe(true)

      if (isLeft(sut)) {
        continue
      }

      const { totalVisits } = unwrapEither(sut)

      expect(totalVisits).toBe(index)
    }
  })

  const slugs = ['invalid@slug', 'url#123', 'foo%20bar']

  it.each(
    slugs
  )('should not be able to increase url visit with an invalid slug param: $0', async slug => {
    const parse = increaseUrlVisitInput.safeParse({ slug })

    expect(parse.success).toBe(false)

    try {
      await increaseUrlVisitUseCase({ slug })

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
