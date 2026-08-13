import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'

export const urls = pgTable(
  'urls',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    unshortenedUrl: text('unshortened_url').notNull(),
    slug: text('slug').notNull().unique(),
    totalVisits: integer('total_visits').notNull().default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  table => [
    index('unshortened_url_idx').on(table.unshortenedUrl),
    uniqueIndex('slug_idx').on(table.slug),
  ]
)
