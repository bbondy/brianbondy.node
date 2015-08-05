import React from 'react';
import Tag from './tag.js';
import {fetchBlogPost, fetchComments, postComment} from './client.js';

var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default class BlogPost extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentWillMount() {
    if (this.props.params && this.props.params.id) {
      fetchBlogPost(this.props.params.id).then((blogPost) => {
        document.title = blogPost.title + ' - Brian R. Bondy';
        this.setState({
          id: blogPost.id,
          title: blogPost.title,
          body: blogPost.body,
          created: new Date(blogPost.created),
          tags: blogPost.tags,
          comments: blogPost.comments,
        });
        return blogPost;
      })
      .then((blogPost) => fetchComments(blogPost.id))
      .then((comments) => {
        console.log(comments);
      });
    } else {
      this.state = {
        id: this.props.id,
        title: this.props.title,
        body: this.props.body,
        created: new Date(this.props.created),
        tags: this.props.tags,
        comments: this.props.comments,
      };
      fetchComments(this.props.id).then((comments) => {
        console.log(comments);
      });
    }
  }

  get blogPostURL() {
    return `/blog/${this.state.id}`;
  }

  get dateString() {
    return `${monthNames[this.state.created.getMonth()]} ${this.state.created.getDate()}, ${this.state.created.getFullYear()}`;
  }

  onPostComment(e) {
    e.preventDefault();
    postComment(this.state.id, {
      name: React.findDOMNode(this.refs.name).value,
      email: React.findDOMNode(this.refs.email).value,
      webpage: React.findDOMNode(this.refs.webpage).value,
      body: React.findDOMNode(this.refs.body).value,
    }).then(() => {
      React.findDOMNode(this.refs.name).value = '';
      React.findDOMNode(this.refs.email).value = '';
      React.findDOMNode(this.refs.webpage).value = '';
      React.findDOMNode(this.refs.body).value = '';
    }).catch(() => {
    });
  }

  render() {
    if (!this.state.title) {
      return null;
    }

    return <div className='blogPost'>
      <h1><a href={this.blogPostURL}>{this.state.title}</a></h1>
      <div className='datePosted'>Posted on {this.dateString}</div>
      <div dangerouslySetInnerHTML={{__html: this.state.body}}/>
      <div className='tags'>{this.state.tags.map(tag => <Tag key={tag} name={tag}/>)}</div>
      { !this.state.comments ? null :
      <div className='commentsContainer'>
        <h2>Comments</h2>
        <input type='button' value='Add a new comment' />
        <form className='commentForm' onSubmit={this.onPostComment.bind(this)}>
          <input ref='name' type='text' placeholder='Name' />
          <input ref='email' type='email' placeholder='Email (Optional)' />
          <input ref='webpage' type='url' placeholder='Website (Optional)' />
          <textarea ref='body' placeholder='Your comment (markdown, but no tags)' />
          <input type='submit' value='Submit' />
        </form>
        <div className='archivedCommentBlock' dangerouslySetInnerHTML={{__html: this.state.comments}}/>
      </div>
      }
    </div>;
  }
}
