import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import z from 'zod'
import { isLeft, isRight, unwrapEither } from '@/shared/either'
import { UnshortenedUrlNotFound } from '../errors/unshortened-url-not-found'
import { createShortUrlUseCase } from './create-short-url-use-case'
import {
  findUnshortenedUrlInput,
  findUnshortenedUrlUseCase,
} from './find-unshortened-url-use-case'

describe('Find unshortened url', () => {
  it('should be able to find unshortened url', async () => {
    const slug = randomUUID().split('-')[0]

    const sut = await createShortUrlUseCase({
      unshortenedUrl: 'https://ftr.rocketseat.com.br',
      slug,
    })

    expect(isRight(sut)).toBe(true)

    const sut2 = await findUnshortenedUrlUseCase({ slug })

    expect(isRight(sut2)).toBe(true)

    if (isLeft(sut2)) {
      return
    }

    const data = unwrapEither(sut2)

    const findUnshortenedUrlOutput = z.object({ unshortenedUrl: z.url() })

    const parse = findUnshortenedUrlOutput.safeParse(data)

    expect(parse.success).toBe(true)
  })

  it('should not be able to find unshortened url if one not exists', async () => {
    const sut = await findUnshortenedUrlUseCase({
      slug: 'non-existent-example',
    })

    expect(isLeft(sut)).toBe(true)

    if (isRight(sut)) {
      return
    }

    const error = unwrapEither(sut)

    expect(error.message).toBe('Unshortened url not found')

    expect(error).toBeInstanceOf(UnshortenedUrlNotFound)
  })

  const slugs = ['invalid@slug', 'url#123', 'foo%20bar']

  it.each(
    slugs
  )('should not be able to find unshortened url with an invalid slug param: $0', async slug => {
    const parse = findUnshortenedUrlInput.safeParse({ slug })

    expect(parse.success).toBe(false)

    try {
      await findUnshortenedUrlUseCase({ slug })

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
