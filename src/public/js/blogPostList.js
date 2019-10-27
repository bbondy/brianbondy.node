import React from 'react'
import { fetchBlogPosts } from './client.js'
import BlogPost from './blogPost.js'
import NavigationButton from './navigationButton.js'

export default class BlogPostList extends React.Component {
  constructor () {
    super()
    this.state = {}
  }

  componentDidMount () {
    fetchBlogPosts({
      year: this.props.match.params.year,
      tag: this.props.match.params.tag,
      page: this.props.match.params.page
    }).then((blogPosts) =>
      this.setState({
        blogPosts
      }))
  }

  urlForPage (page) {
    var pageSuffix = '/'
    if (page !== 1) {
      pageSuffix = `/page/${page}`
    }
    if (this.props.match.params.year) {
      return `/blog/posted/${this.props.match.params.year}${pageSuffix}`
    } else if (this.props.match.params.tag) {
      return `/blog/tagged/${this.props.match.params.tag}${pageSuffix}`
    } else {
      return `${pageSuffix}`
    }
  }

  get page () {
    return Number(this.props.match.params.page || 1)
  }

  get nextUrl () {
    return this.urlForPage(this.page + 1)
  }

  get prevUrl () {
    return this.urlForPage(this.page - 1)
  }

  render () {
    if (!this.state.blogPosts) {
      return null
    }

    if (this.state.blogPosts.length === 0) {
      return (
        <div> No blog posts for this query</div>
      )
    }

    return (
      <div>
        {
          this.state.blogPosts.map(blogPost =>
            <BlogPost
              title={blogPost.title}
              key={blogPost.id}
              body={blogPost.body}
              created={blogPost.created}
              tags={blogPost.tags}
              id={blogPost.id}
              url={blogPost.url}
            />)
        }
        {this.page > 1
          ? <NavigationButton text='Previous page' src={this.prevUrl} /> : null}
        {this.state.blogPosts.length === 3
          ? <NavigationButton text='Next page' src={this.nextUrl} /> : null}
      </div>)
  }
}
