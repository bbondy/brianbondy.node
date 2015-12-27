import React from 'react'
import ReactDOM from 'react-dom'
import {fetchMarkdown} from './client.js'
import marked from './marked'
import externalLinkSetup from './externalLinkSetup.js'

export default class RemoteViewer extends React.Component {
  constructor () {
    super()
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
    let src = `${window.location.pathname.substring(1)}.markdown`
    const func = this.props.fetchFunc || fetchMarkdown
    func(this.props.src || src).then((markdownText) =>
      this.setState({markdownText}))
  }
  componentWillReceiveProps () {
    this.fetch()
  }
  componentWillMount () {
    this.fetch()
  }
  componentDidUpdate () {
    externalLinkSetup(ReactDOM.findDOMNode(this.refs.markdownContainer))
  }
  render () {
    // Add progress indicator on first load
    if (!this.state.markdownText) {
      return <span className='fa fa-circle-o-notch fa-spin'/>
    }
    return <div>
      <div ref='markdownContainer' dangerouslySetInnerHTML={
        {__html: marked(this.state.markdownText)}}/></div>
  }
}

RemoteViewer.propTypes = { fetchFunc: React.PropTypes.func, src: React.PropTypes.string }
