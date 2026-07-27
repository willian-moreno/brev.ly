export async function readStreamAsString(stream: NodeJS.ReadableStream) {
  return new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = []

    stream.on('data', (chunk: Buffer) => {
      chunks.push(chunk)
    })

    stream.on('end', () => {
      resolve(Buffer.concat(chunks).toString('utf-8'))
    })

    stream.on('error', error => {
      reject(error)
    })
  })
}
