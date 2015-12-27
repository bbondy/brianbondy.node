import React from 'react'
import ReactDOM from 'react-dom'
import Tag from './tag.js'
import {fetchBlogPost, fetchComments} from './client.js'
import {formatDate} from './formatDate.js'
import externalLinkSetup from './externalLinkSetup.js'
import {Comments, AddComment} from './comments.js'

export default class BlogPost extends React.Component {
  constructor () {
    super()
    this.state = {}
  }

  loadComments (id) {
    fetchComments(id)
      .then(comments => this.setState({
          comments,
      }))
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
          url: blogPost.url,
        })
        return blogPost
      })
      .then((blogPost) => this.loadComments(blogPost.id))
    } else {
      this.state = {
        id: this.props.id,
        title: this.props.title,
        body: this.props.body,
        created: new Date(this.props.created),
        tags: this.props.tags,
        url: this.props.url,
      }
      this.loadComments(this.props.id)
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
      { !this.state.comments ? null :
      <div className='commentsContainer'>
        <h2>Comments</h2>
        <AddComment blogPostId={this.state.id}
          reloadComments={this.loadComments.bind(this, this.state.id)}/>
        <Comments blogPostId={this.state.id}
          comments={this.state.comments}
          reloadComments={this.loadComments.bind(this, this.state.id)}/>
      </div>
      }
    </article>
  }
}
