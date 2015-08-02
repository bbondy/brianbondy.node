import React from 'react';
import Tag from './tag.js';
import {fetchBlogPost} from './client.js';

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
    }
  }

  get blogPostURL() {
    return `/blog/${this.state.id}`;
  }

  get dateString() {
    return `${monthNames[this.state.created.getMonth()]} ${this.state.created.getDate()}, ${this.state.created.getFullYear()}`;
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
        <div className='commentsDisabled'>New comments disabled</div>
        <div className='archivedCommentBlock' dangerouslySetInnerHTML={{__html: this.state.comments}}/>
      </div>
      }
    </div>;
  }
}
