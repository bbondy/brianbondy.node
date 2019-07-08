import React from 'react'
import ReactDOM from 'react-dom'
import Tag from './tag.js'
import {fetchBlogPost} from './client.js'
import {formatDate} from './formatDate.js'
import externalLinkSetup from './externalLinkSetup.js'

export default class BlogPost extends React.Component {
  constructor () {
    super()
    this.state = {}
  }

  componentWillMount () {
    if (this.props.params && this.props.params.id) {
      fetchBlogPost(this.props.params.id).then((blogPost) => {
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
      this.state = {
        id: this.props.id,
        title: this.props.title,
        body: this.props.body,
        created: new Date(this.props.created),
        tags: this.props.tags,
        url: this.props.url
      }
    }
  }

  get blogPostURL () {
    return this.state.url
  }

  componentDidUpdate () {
    externalLinkSetup(ReactDOM.findDOMNode(this.refs.blogDiv))
  }

  render () {
    if (!this.state.title) {
      return null
    }
    return <article className='blogPost'>
      <h1><a href={this.blogPostURL}>{this.state.title}</a></h1>
      <div className='datePosted'>Posted on {formatDate(this.state.created)}</div>
      <div ref='blogDiv' dangerouslySetInnerHTML={{__html: this.state.body}}/>
      <div className='tags'>{this.state.tags.map(tag => <Tag key={tag} name={tag}/>)}</div>
    </article>
  }
}

BlogPost.propTypes = { id: React.PropTypes.any, url: React.PropTypes.string, tags: React.PropTypes.arrayOf(React.PropTypes.string), created: React.PropTypes.any, body: React.PropTypes.string, title: React.PropTypes.string, params: React.PropTypes.object }
