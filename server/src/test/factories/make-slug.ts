import { faker } from '@faker-js/faker'

export function makeSlug() {
  return `${faker.lorem.word()}-${faker.string.uuid().slice(0, 8)}`
}
