import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import z from 'zod'
import { isLeft, isRight, unwrapEither } from '@/shared/either'
import { createShortUrlUseCase } from './create-short-url-use-case'
import {
  type FindUrlsInput,
  findUrlsInput,
  findUrlsUseCase,
} from './find-urls-use-case'

describe('Find urls', () => {
  describe('search', () => {
    it('should find urls matching the search term in unshortenedUrl', async () => {
      const token = randomUUID().split('-')[0]
      const slugA = `${token}-a`
      const slugB = `${token}-b`

      await createShortUrlUseCase({
        unshortenedUrl: `https://ftr.rocketseat.com.br/${token}`,
        slug: slugA,
      })

      await createShortUrlUseCase({
        unshortenedUrl: `https://ftr.rocketseat.com.br/${token}`,
        slug: slugB,
      })

      const sut = await findUrlsUseCase({ search: token })

      expect(isRight(sut)).toBe(true)

      if (isLeft(sut)) {
        return
      }

      const { items, total } = unwrapEither(sut)

      expect(total).toBe(2)
      expect(items).toHaveLength(2)
      expect(items.map(item => item.slug).sort()).toEqual([slugA, slugB].sort())
    })

    it('should find urls matching the search term in slug', async () => {
      const token = randomUUID().split('-')[0]
      const slug = `${token}-unique-slug`

      await createShortUrlUseCase({
        unshortenedUrl: 'https://ftr.rocketseat.com.br',
        slug,
      })

      const sut = await findUrlsUseCase({ search: token })

      expect(isRight(sut)).toBe(true)

      if (isLeft(sut)) {
        return
      }

      const { items, total } = unwrapEither(sut)

      expect(total).toBe(1)
      expect(items[0].slug).toBe(slug)
    })

    it('should return an empty list when the search term matches nothing', async () => {
      const sut = await findUrlsUseCase({
        search: `nonexistent-${randomUUID()}`,
      })

      expect(isRight(sut)).toBe(true)

      if (isLeft(sut)) {
        return
      }

      const { items, total } = unwrapEither(sut)

      expect(total).toBe(0)
      expect(items).toEqual([])
    })

    it('should treat a whitespace-only search as no filter', async () => {
      const withoutSearch = await findUrlsUseCase({})
      const withWhitespaceSearch = await findUrlsUseCase({ search: '   ' })

      expect(isRight(withoutSearch)).toBe(true)
      expect(isRight(withWhitespaceSearch)).toBe(true)

      if (isLeft(withoutSearch) || isLeft(withWhitespaceSearch)) {
        return
      }

      const noSearchData = unwrapEither(withoutSearch)
      const whitespaceData = unwrapEither(withWhitespaceSearch)

      expect(whitespaceData.total).toBe(noSearchData.total)
    })
  })

  describe('sorting', () => {
    it('should sort results by slug in ascending order', async () => {
      const token = randomUUID().split('-')[0]
      const slugA = `${token}-a`
      const slugB = `${token}-b`
      const slugC = `${token}-c`

      await createShortUrlUseCase({
        unshortenedUrl: `https://ftr.rocketseat.com.br`,
        slug: slugC,
      })

      await createShortUrlUseCase({
        unshortenedUrl: `https://ftr.rocketseat.com.br`,
        slug: slugA,
      })

      await createShortUrlUseCase({
        unshortenedUrl: `https://ftr.rocketseat.com.br`,
        slug: slugB,
      })

      const sut = await findUrlsUseCase({
        search: token,
        sortBy: 'slug',
        sortDirection: 'asc',
      })

      expect(isRight(sut)).toBe(true)

      if (isLeft(sut)) {
        return
      }

      const { items } = unwrapEither(sut)

      expect(items.map(item => item.slug)).toEqual([slugA, slugB, slugC])
    })

    it('should sort results by slug in descending order', async () => {
      const token = randomUUID().split('-')[0]
      const slugA = `${token}-a`
      const slugB = `${token}-b`
      const slugC = `${token}-c`

      await createShortUrlUseCase({
        unshortenedUrl: `https://ftr.rocketseat.com.br`,
        slug: slugA,
      })

      await createShortUrlUseCase({
        unshortenedUrl: `https://ftr.rocketseat.com.br`,
        slug: slugB,
      })

      await createShortUrlUseCase({
        unshortenedUrl: `https://ftr.rocketseat.com.br`,
        slug: slugC,
      })

      const sut = await findUrlsUseCase({
        search: token,
        sortBy: 'slug',
        sortDirection: 'desc',
      })

      expect(isRight(sut)).toBe(true)

      if (isLeft(sut)) {
        return
      }

      const { items } = unwrapEither(sut)

      expect(items.map(item => item.slug)).toEqual([slugC, slugB, slugA])
    })

    it('should apply a deterministic default sort when no sort params are provided', async () => {
      const token = randomUUID().split('-')[0]
      const slug1 = `${token}-1`
      const slug2 = `${token}-2`

      await createShortUrlUseCase({
        unshortenedUrl: `https://ftr.rocketseat.com.br`,
        slug: slug1,
      })

      await createShortUrlUseCase({
        unshortenedUrl: `https://ftr.rocketseat.com.br`,
        slug: slug2,
      })

      const first = await findUrlsUseCase({ search: token })
      const second = await findUrlsUseCase({ search: token })

      expect(isRight(first)).toBe(true)
      expect(isRight(second)).toBe(true)

      if (isLeft(first) || isLeft(second)) {
        return
      }

      const firstData = unwrapEither(first)
      const secondData = unwrapEither(second)

      expect(firstData.total).toBe(2)

      expect(firstData.items.map(item => item.id)).toEqual(
        secondData.items.map(item => item.id)
      )
    })
  })

  describe('pagination', () => {
    it('should paginate results according to page and pageSize', async () => {
      const token = randomUUID().split('-')[0]
      const slugs = [1, 2, 3, 4, 5].map(n => `${token}-${n}`)

      for (const slug of slugs) {
        await createShortUrlUseCase({
          unshortenedUrl: 'https://ftr.rocketseat.com.br',
          slug,
        })
      }

      const page1 = await findUrlsUseCase({
        search: token,
        sortBy: 'slug',
        sortDirection: 'asc',
        page: 1,
        pageSize: 2,
      })

      const page2 = await findUrlsUseCase({
        search: token,
        sortBy: 'slug',
        sortDirection: 'asc',
        page: 2,
        pageSize: 2,
      })

      const page3 = await findUrlsUseCase({
        search: token,
        sortBy: 'slug',
        sortDirection: 'asc',
        page: 3,
        pageSize: 2,
      })

      expect(isRight(page1)).toBe(true)
      expect(isRight(page2)).toBe(true)
      expect(isRight(page3)).toBe(true)

      if (isLeft(page1) || isLeft(page2) || isLeft(page3)) {
        return
      }

      const data1 = unwrapEither(page1)
      const data2 = unwrapEither(page2)
      const data3 = unwrapEither(page3)

      expect(data1.total).toBe(5)
      expect(data1.items.map(item => item.slug)).toEqual([slugs[0], slugs[1]])
      expect(data2.items.map(item => item.slug)).toEqual([slugs[2], slugs[3]])
      expect(data3.items.map(item => item.slug)).toEqual([slugs[4]])
    })

    it('should not apply pagination when page is 0, due to the falsy check in the use case', async () => {
      const token = randomUUID().split('-')[0]
      const slugs = [1, 2, 3].map(n => `${token}-${n}`)

      for (const slug of slugs) {
        await createShortUrlUseCase({
          unshortenedUrl: 'https://ftr.rocketseat.com.br',
          slug,
        })
      }

      const sut = await findUrlsUseCase({
        search: token,
        page: 0,
        pageSize: 2,
      })

      expect(isRight(sut)).toBe(true)

      if (isLeft(sut)) {
        return
      }

      const { items, total } = unwrapEither(sut)

      expect(total).toBe(3)
      expect(items).toHaveLength(3)
    })
  })

  describe('input validation', () => {
    it('should accept an empty input object, since every field is optional', () => {
      const parse = findUrlsInput.safeParse({})
      expect(parse.success).toBe(true)
    })

    it('should coerce page and pageSize string values into numbers', () => {
      const parse = findUrlsInput.safeParse({ page: '1', pageSize: '10' })
      expect(parse.success).toBe(true)

      if (parse.success) {
        expect(parse.data.page).toBe(1)
        expect(parse.data.pageSize).toBe(10)
      }
    })

    const invalidInputs: { description: string; input: unknown }[] = [
      {
        description: 'invalid sortBy value',
        input: { sortBy: 'invalidField' },
      },
      {
        description: 'invalid sortDirection value',
        input: { sortDirection: 'ascending' },
      },
      { description: 'page below the minimum of 0', input: { page: -1 } },
      {
        description: 'pageSize below the minimum of 1',
        input: { pageSize: 0 },
      },
    ]

    it.each(
      invalidInputs
    )('should not be able to find urls with $description', async ({
      input,
    }) => {
      const parse = findUrlsInput.safeParse(input)

      expect(parse.success).toBe(false)

      await expect(
        findUrlsUseCase(input as FindUrlsInput)
      ).rejects.toBeInstanceOf(z.ZodError)
    })
  })
})
