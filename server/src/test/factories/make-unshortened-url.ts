import { faker } from '@faker-js/faker'

export function makeUnshortenedUrl() {
  return faker.internet.url()
}
