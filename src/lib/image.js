export function optimizeImageUrl(url, width = 800, quality = 72) {
  if (!url) return ''

  try {
    const imageUrl = new URL(url)

    // Unsplash accepts these params and serves optimized formats automatically.
    if (imageUrl.hostname.includes('unsplash.com')) {
      imageUrl.searchParams.set('auto', 'format')
      imageUrl.searchParams.set('fit', 'crop')
      imageUrl.searchParams.set('w', String(width))
      imageUrl.searchParams.set('q', String(quality))
      return imageUrl.toString()
    }

    return url
  } catch {
    return url
  }
}
