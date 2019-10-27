import React from 'react'
import { fetchMarkdown } from './client.js'
import marked from './marked'
import externalLinkSetup from './externalLinkSetup.js'

export default class RemoteViewer extends React.Component {
  constructor () {
    super()
    this.markdownContainerRef = React.createRef()
    this.state = {
      markdownText: ''
    }
  }

  get pageTitle () {
    return {
      '/blog/filters': 'Blog Filters'
    }[window.location.pathname]
  }

  fetch () {
    const src = `${window.location.pathname.substring(1)}.markdown`
    const func = this.props.fetchFunc || fetchMarkdown
    func(this.props.src || src).then((markdownText) =>
      this.setState({ markdownText }))
  }

  componentWillReceiveProps () {
    this.fetch()
  }

  componentDidMount () {
    this.fetch()
  }

  componentDidUpdate () {
    externalLinkSetup(this.markdownContainerRef.current)
  }

  render () {
    // Add progress indicator on first load
    if (!this.state.markdownText) {
      return <span className='fa fa-circle-o-notch fa-spin' />
    }
    return (
      <div>
        <div
          ref={this.markdownContainerRef}
          dangerouslySetInnerHTML={{ __html: marked(this.state.markdownText) }}
        />
      </div>)
  }
}
