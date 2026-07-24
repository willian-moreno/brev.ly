import { randomUUID } from 'node:crypto'

export function makeSlug() {
  return randomUUID().split('-')[0]
}
