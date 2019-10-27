export function titleByPath (pathname) {
  const parts = pathname.substring(1).split('/')
  if (pathname.startsWith('/blog/tagged/')) {
    const tag = parts[2]
    let page = ''
    if (parts[3] === 'page') {
      page = ` page ${parts[4]}`
    }
    return `Posts tagged ${tag}${page}`
  } else if (pathname.startsWith('/blog/posted/')) {
    const year = parts[2]
    let page = ''
    if (parts[3] === 'page') {
      page = ` page ${parts[4]}`
    }
    return `Posted in ${year}${page}`
  } else if (pathname.startsWith('/page/')) {
    const page = parts[1]
    return `Blog posts page ${page}`
  }

  let path = {
    '/': 'Blog posts',
    '/blog/filters': 'Blog filters',
    '/projects': 'Projects',
    '/resume': 'Resume',
    '/other': 'Other',
    '/about': 'About',
    '/contact': 'Contact',
    '/advice': 'Advice',
    '/articles': 'Articles',
    '/books': 'Books',
    '/braille': 'Braille',
    '/compression': 'Compression',
    '/compression/huffman': 'Huffman compression',
    '/compression/BWT': 'Burrows-Wheeler',
    '/compression/PPM': 'Prediction by partial matching',
    '/khanacademy': 'Khan Academy',
    '/math': 'Mathematics',
    '/math/pi': 'Pi',
    '/math/primes': 'Primes',
    '/math/numberTheory': 'Number theory',
    '/math/graphTheory': 'Graph theory',
    '/math/mathTricks': 'Math tricks',
    '/morseCode': 'Morse code',
    '/mozilla': 'Mozilla',
    '/mozilla/new': 'New to Mozilla',
    '/stackexchange': 'Stack Exchange',
    '/universityClasses': 'University classes'
  }[pathname] || ''
  if (path) {
    path += ' - '
  }
  return path
}

export function pageTitleByPath (pathname) {
  const suffix = 'Brian R. Bondy'
  const title = titleByPath(pathname)
  if (!title) {
    return suffix
  }
  return `${title} - ${suffix}`
}
