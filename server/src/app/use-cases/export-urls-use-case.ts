import { PassThrough, Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { stringify } from 'csv-stringify'
import { ilike, or } from 'drizzle-orm'
import z from 'zod'
import { FailureToUploadToStorage } from '@/app/errors/failure-to-upload-to-storage'
import { db, pg } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { uploadFileToStorage } from '@/infra/storage/upload-file-to-storage'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import 'dayjs/locale/pt-br'
import dayjs from 'dayjs'

dayjs.locale('pt-br')

export const exportUrlsInput = z.object({
  search: z.string().optional(),
})

export type ExportUrlsInput = z.input<typeof exportUrlsInput>

export const uploadToStorageOutput = z.object({
  key: z.string(),
  url: z.url(),
})

export type ExportUrlsOutput = {
  reportUrl: string
}

export async function exportUrlsUseCase(
  input: ExportUrlsInput
): Promise<Either<Error, ExportUrlsOutput>> {
  const { search } = exportUrlsInput.parse(input)

  const { sql, params } = db
    .select({
      unshortenedUrl: schema.shortenedUrls.unshortenedUrl,
      slug: schema.shortenedUrls.slug,
      totalVisits: schema.shortenedUrls.totalVisits,
      createdAt: schema.shortenedUrls.createdAt,
    })
    .from(schema.shortenedUrls)
    .where(
      search && search.trim().length > 0
        ? or(
            ilike(schema.shortenedUrls.unshortenedUrl, `%${search}%`),
            ilike(schema.shortenedUrls.slug, `%${search}%`)
          )
        : undefined
    )
    .toSQL()

  const cursor = pg.unsafe(sql, params as string[]).cursor(20)

  const csv = stringify({
    header: true,
    delimiter: ',',
    columns: [
      { key: 'unshortened_url', header: 'Original URL' },
      { key: 'slug', header: 'Short URL' },
      { key: 'total_visits', header: 'Total visits' },
      { key: 'created_at', header: 'Created at' },
    ],
  })

  const uploadToStorageStream = new PassThrough()

  const convertToCSVPipeline = pipeline(
    cursor,
    new Transform({
      objectMode: true,
      transform(
        chunks: {
          unshortened_url: string
          slug: string
          total_visits: string
          created_at: string
        }[],
        _,
        callback
      ) {
        for (const chunk of chunks) {
          chunk.created_at = dayjs(chunk.created_at as string).format(
            'DD/MM/YYYY HH:mm'
          )

          this.push(chunk)
        }

        callback()
      },
    }),
    csv,
    uploadToStorageStream
  )

  const uploadCSVToStorage = uploadFileToStorage({
    folder: 'downloads',
    contentType: 'text/csv',
    fileName: `${dayjs().format('YYYYMMDDHHmm')}-urls.csv`,
    contentStream: uploadToStorageStream,
  })

  const [uploadToStorageResult] = await Promise.all([
    uploadCSVToStorage,
    convertToCSVPipeline,
  ])

  const parse = uploadToStorageOutput.safeParse(uploadToStorageResult)

  if (!parse.success) {
    return makeLeft(new FailureToUploadToStorage())
  }

  return makeRight({ reportUrl: parse.data.url })
}
