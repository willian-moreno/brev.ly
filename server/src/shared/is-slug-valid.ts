export function isSlugValid(uuid: string) {
  return !/[^a-zA-Z0-9-_]/.test(uuid)
}
