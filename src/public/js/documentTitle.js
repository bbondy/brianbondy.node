import React from 'react'

export default class DocumentTitle extends React.Component {
  get titleByPath () {
    const suffix = 'Brian R. Bondy'
    const parts = window.location.pathname.substring(1).split('/')
    if (this.props.pathname.startsWith('/blog/tagged/')) {
      const tag = parts[2]
      let page = ''
      if (parts[3] === 'page') {
        page = ` page ${parts[4]}`
      }
      return `Posts tagged ${tag}${page} - ${suffix}`
    } else if (this.props.pathname.startsWith('/blog/posted/')) {
      const year = parts[2]
      let page = ''
      if (parts[3] === 'page') {
        page = ` page ${parts[4]}`
      }
      return `Posted in ${year}${page} - ${suffix}`
    } else if (this.props.pathname.startsWith('/page/')) {
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
      '/faq': 'F.A.Q.',
      '/khanacademy': 'Khan Academy',
      '/links': 'Links',
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
    }[this.props.pathname] || ''
    if (path) {
      path += ' - '
    }
    path += suffix
    return path
  }

  componentDidMount () {
    document.title = this.titleByPath
  }

  componentDidUpdate () {
    document.title = this.titleByPath
  }

  render () {
    return null
  }
}
