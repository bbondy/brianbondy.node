import React from 'react';
import Tag from './tag.js';
import {fetchBlogPost, fetchComments, postComment, fetchCaptcha} from './client.js';
import {cx} from './class-set.js';
import marked from './unsafe-marked.js';
import {formatDate, formatTime} from './formatDate.js';

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
  get datePostedOn() {
    if (!this.props.comment.datePosted) {
      return '';
    }

    let date = new Date(this.props.comment.datePosted);
    return ' on ' + formatDate(date) + ' at ' + formatTime(date);
  }
  render() {
    let comment = this.props.comment;
    let img = <img src={this.gravatarHash} className='gravatar'/>;
    let name = comment.name;
    return <div className='comment-item'>
      <div>
        {
          comment.webpage ?
            <a rel='extern nofollow' href={comment.webpage} target='_blank'>
              {img}
            </a> : {img}
        }
      </div>
      <span>
      {
        comment.webpage ?
          <a rel='external nofollow' href={comment.webpage} target='_blank'>
            {name}
          </a> : {name}
      }
      </span>
      <span className='datePosted'>{this.datePostedOn}</span>
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

  loadComments(id) {
    fetchComments(id)
      .then(comments =>
        this.setState({
          comments,
        }));

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
      .then((blogPost) => this.loadComments(blogPost.id));
    } else {
      this.state = {
        id: this.props.id,
        title: this.props.title,
        body: this.props.body,
        created: new Date(this.props.created),
        tags: this.props.tags,
      };
      this.loadComments(this.props.id);
    }
  }

  get blogPostURL() {
    return `/blog/${this.state.id}`;
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
      this.loadComments(this.state.id);
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
    return <div className='blogPost'>
      <h1><a href={this.blogPostURL}>{this.state.title}</a></h1>
      <div className='datePosted'>Posted on {formatDate(this.state.created)}</div>
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
