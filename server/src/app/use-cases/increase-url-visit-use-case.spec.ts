import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import z from 'zod'
import { UrlNotFound } from '@/app/errors/url-not-found'
import { isLeft, isRight, unwrapEither } from '@/shared/either'
import { createShortUrlUseCase } from './create-short-url-use-case'
import {
  type IncreaseUrlVisitInput,
  increaseUrlVisitInput,
  increaseUrlVisitUseCase,
} from './increase-url-visit-use-case'

describe('Increase url visit', () => {
  describe('happy path', () => {
    it('should increase the total visits by 1 for an existing slug', async () => {
      const token = randomUUID().split('-')[0]
      const slug = `non-existent-${token}`

      const created = await createShortUrlUseCase({
        unshortenedUrl: 'https://ftr.rocketseat.com.br',
        slug,
      })

      expect(isRight(created)).toBe(true)

      const first = await increaseUrlVisitUseCase({ slug })
      const second = await increaseUrlVisitUseCase({ slug })

      expect(isRight(first)).toBe(true)
      expect(isRight(second)).toBe(true)

      if (isLeft(first) || isLeft(second)) {
        return
      }

      const firstData = unwrapEither(first)
      const secondData = unwrapEither(second)

      expect(secondData.totalVisits).toBe(firstData.totalVisits + 1)
    })

    it('should return the correct shape and increment multiple times consistently', async () => {
      const token = randomUUID().split('-')[0]
      const slug = `non-existent-${token}`

      await createShortUrlUseCase({
        unshortenedUrl: 'https://ftr.rocketseat.com.br',
        slug,
      })

      const first = await increaseUrlVisitUseCase({ slug })

      expect(isRight(first)).toBe(true)

      if (isLeft(first)) {
        return
      }

      const baseline = unwrapEither(first).totalVisits

      const increaseUrlVisitOutput = z.object({
        totalVisits: z.number().int().nonnegative(),
      })

      const results = []

      for (let i = 0; i < 3; i++) {
        const sut = await increaseUrlVisitUseCase({ slug })

        expect(isRight(sut)).toBe(true)

        if (isLeft(sut)) {
          return
        }

        const data = unwrapEither(sut)
        const parse = increaseUrlVisitOutput.safeParse(data)

        expect(parse.success).toBe(true)

        results.push(data.totalVisits)
      }

      expect(results).toEqual([baseline + 1, baseline + 2, baseline + 3])
    })
  })

  describe('not found', () => {
    it('should not be able to increase the visit count for a slug that does not exist', async () => {
      const token = randomUUID().split('-')[0]
      const slug = `non-existent-${token}`

      const sut = await increaseUrlVisitUseCase({ slug })

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
    )('should not be able to increase the visit count with $description', async ({
      slug,
    }) => {
      const input: IncreaseUrlVisitInput = { slug }

      const parse = increaseUrlVisitInput.safeParse(input)

      expect(parse.success).toBe(false)

      await expect(increaseUrlVisitUseCase(input)).rejects.toBeInstanceOf(
        z.ZodError
      )
    })

    it('should accept a valid slug', () => {
      const parse = increaseUrlVisitInput.safeParse({
        slug: randomUUID().split('-')[0],
      })

      expect(parse.success).toBe(true)
    })
  })
})
