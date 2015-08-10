import React from 'react';
import Tag from './tag.js';
import {fetchBlogPost, fetchComments, postComment, fetchCaptcha} from './client.js';
import {cx} from './class-set.js';
import marked from './unsafe-marked.js';

var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

class Comments extends React.Component {
  render() {
    if (!this.props.comments) {
      return null;
    }

    return <div className='comments-container'>
      <div className='comments-list'>
      {
        this.props.comments.map(comment => <Comment comment={comment}/>)
      }
      </div>
    </div>;
  }
}

class Comment extends React.Component {
  get gravatarHash() {
    return `http://www.gravatar.com/avatar/${this.props.comment.gravatarHash}?s=60`;
  }
  get body() {
    return this.props.comment.body.replace(/<(?:.|\n)*?>/gm, '');
  }
  render() {
    let comment = this.props.comment;
    console.log(marked(comment.body));
    return <div className='comment-item'>
      <div>
        <a href={comment.website} target='_blank'>
          <img src={this.gravatarHash} className='gravatar'/>
        </a>
      </div>
      <a rel='external nofollow' href={comment.website}>{comment.name}</a>
      <span> on </span><span className='datePosted'>{comment.datePosted}</span>
      <span> says: </span>
      <p className='comment-text' dangerouslySetInnerHTML={{__html: marked(this.body)}}/>
    </div>;
  }
}

export default class BlogPost extends React.Component {
  constructor() {
    super();
    this.state = {
      showAddCommentForm: false,
    };
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
        });
        return blogPost;
      })
      .then((blogPost) => fetchComments(blogPost.id))
      .then((comments) => {
        this.setState({
          comments,
        });
        console.log(comments);
      });
    } else {
      this.state = {
        id: this.props.id,
        title: this.props.title,
        body: this.props.body,
        created: new Date(this.props.created),
        tags: this.props.tags,
      };
      fetchComments(this.props.id).then((comments) => {
        console.log(comments);
        this.setState({
          comments,
        });
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
      captcha: React.findDOMNode(this.refs.captcha).value,
    }).then(() => {
      React.findDOMNode(this.refs.name).value = '';
      React.findDOMNode(this.refs.email).value = '';
      React.findDOMNode(this.refs.webpage).value = '';
      React.findDOMNode(this.refs.body).value = '';
      React.findDOMNode(this.refs.captcha).value = '';
      this.refreshCaptcha();
      alert('Thank you, your comment was posted!');
    }).catch((statusCode) => {
      if (statusCode === 405) {
        // Captcha invalid show a captcha error
        React.findDOMNode(this.refs.captcha).value = '';
        this.refreshCaptcha();
        alert('The captcha entered does not match what was expected! Please try again!');
      } else {
        // Some kind of other error, show a generic posting error
        React.findDOMNode(this.refs.captcha).value = '';
        this.refreshCaptcha();
        alert('There was an error posting the comment!');
      }
    });
  }

  refreshCaptcha() {
    fetchCaptcha(this.state.id).then(captchaDataUrl => this.setState({
      captchaDataUrl,
    }));
  }

  onClickAddComment() {
    this.refreshCaptcha();
    this.setState({
      showAddCommentForm: true,
    });
  }

  render() {
    if (!this.state.title) {
      return null;
    }
    console.log(this.state.comments);

    return <div className='blogPost'>
      <h1><a href={this.blogPostURL}>{this.state.title}</a></h1>
      <div className='datePosted'>Posted on {this.dateString}</div>
      <div dangerouslySetInnerHTML={{__html: this.state.body}}/>
      <div className='tags'>{this.state.tags.map(tag => <Tag key={tag} name={tag}/>)}</div>
      { !this.state.comments ? null :
      <div className='commentsContainer'>
        <h2>Comments</h2>
        <input className={cx({
          hideAddCommentForm: this.state.showAddCommentForm,
        })} type='button' value='Add a new comment' onClick={this.onClickAddComment.bind(this)} />
        <form className={cx({
            addCommentForm: true,
            hideAddCommentForm: !this.state.showAddCommentForm,
          })} onSubmit={this.onPostComment.bind(this)}>
          <h2>Add a new comment</h2>
          <input ref='name' type='text' placeholder='Name' required />
          <input ref='email' type='email' placeholder='Email (Optional)' />
          <input ref='webpage' type='url' placeholder='Website (Optional)' />
          <textarea ref='body' placeholder='Your comment (markdown, but no tags)' required />
          <input className='captchaInput' ref='captcha' type='text' placeholder='Enter the text to the right' required />
          { !this.state.captchaDataUrl ? null :
          <img className='captchaImage' src={this.state.captchaDataUrl}/>
          }
          <input type='submit' value='Submit' />
        </form>
        <Comments comments={this.state.comments}/>
      </div>
      }
    </div>;
  }
}
