import axios from 'axios'

export async function downloadUrl(url: string, filename: string) {
  try {
    const { data } = await axios.get(url, {
      responseType: 'blob',
    })

    const blobUrl = window.URL.createObjectURL(new Blob([data]))

    const link = document.createElement('a')

    link.href = blobUrl
    link.download = filename

    document.body.appendChild(link)

    link.click()

    document.body.removeChild(link)

    URL.revokeObjectURL(blobUrl)
  } catch (error) {
    console.error(error)
  }
}
