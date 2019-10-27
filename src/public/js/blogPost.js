import React from 'react'
import Tag from './tag.js'
import { fetchBlogPost } from './client.js'
import { formatDate } from './formatDate.js'
import externalLinkSetup from './externalLinkSetup.js'

export default class BlogPost extends React.Component {
  constructor () {
    super()
    this.blogDiv = React.createRef()
    this.state = {}
  }

  componentDidMount () {
    if (this.props.match && this.props.match.params && this.props.match.params.id) {
      fetchBlogPost(this.props.match.params.id).then((blogPost) => {
        document.title = blogPost.title + ' - Brian R. Bondy'
        this.setState({
          id: blogPost.id,
          title: blogPost.title,
          body: blogPost.body,
          created: new Date(blogPost.created),
          tags: blogPost.tags,
          url: blogPost.url
        })
        return blogPost
      })
    } else {
      this.setState({
        id: this.props.id,
        title: this.props.title,
        body: this.props.body,
        created: new Date(this.props.created),
        tags: this.props.tags,
        url: this.props.url
      })
    }
  }

  get blogPostURL () {
    return this.state.url
  }

  componentDidUpdate () {
    externalLinkSetup(this.blogDiv.current)
  }

  render () {
    if (!this.state.title) {
      return null
    }
    return (
      <article className='blogPost'>
        <h1><a href={this.blogPostURL}>{this.state.title}</a></h1>
        <div className='datePosted'>Posted on {formatDate(this.state.created)}</div>
        <div ref={this.blogDiv} dangerouslySetInnerHTML={{ __html: this.state.body }} />
        <div className='tags'>{this.state.tags.map(tag => <Tag key={tag} name={tag} />)}</div>
      </article>)
  }
}
