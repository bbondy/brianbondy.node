import React from 'react'
import ReactDOM from 'react-dom'
import {deleteComment, fetchCaptcha, postComment} from './client.js'
import marked from './unsafe-marked.js'
import {formatDate, formatTime} from './formatDate.js'
import externalLinkSetup from './externalLinkSetup.js'
import {cx} from './class-set.js'

function stripHTML (str) {
  return str.replace(/<(?:.|\n)*?>/gm, '')
}

export class Comments extends React.Component {
  render () {
    if (!this.props.comments) {
      return null
    }

    // We use the index as the key since we have nothing better and since users can't remove comments
    return <div className='comments-container'>
      <div className='comments-list'>
      {
        this.props.comments.map((comment, i) => <Comment key={i} blogPostId={this.props.blogPostId}
          reloadComments={this.props.reloadComments} comment={comment}/>)
      }
      </div>
    </div>
  }
}

Comments.propTypes = { comments: React.PropTypes.any, blogPostId: React.PropTypes.any, reloadComments: React.PropTypes.any }

export class Comment extends React.Component {
  get gravatarHash () {
    return `https://www.gravatar.com/avatar/${this.props.comment.gravatarHash}?s=60`
  }
  get body () {
    return stripHTML(this.props.comment.body)
  }
  get datePostedOn () {
    if (!this.props.comment.datePosted) {
      return ''
    }

    let date = new Date(this.props.comment.datePosted)
    if (!(date instanceof Date) || !isFinite(date)) {
      date = new Date(this.props.comment.datePosted.replace(' ', 'T'))
    }

    return ' on ' + formatDate(date) + ' at ' + formatTime(date)
  }
  removeComment (blogPostId, comment) {
    deleteComment(blogPostId, comment).then(this.props.reloadComments).catch(statusCode => {
      if (statusCode === 405) {
        window.alert('Error deleting comment: Wrong admin mode password!')
      } else {
        window.alert('Error deleting comment!')
      }
    })
  }
  componentDidMount () {
    externalLinkSetup(ReactDOM.findDOMNode(this.refs.commentItem))
  }

  get webpage () {
    let comment = this.props.comment
    if (comment.webpage && comment.webpage.indexOf('http://brianbondy.com') === 0 || comment.webpage.indexOf('http://www.brianbondy.com') === 0) {
      return comment.webpage.replace('http://', 'https://')
    }
    return comment.webpage
  }
  render () {
    let comment = this.props.comment
    return <div ref='commentItem' className='comment-item'>
      <span onClick={this.removeComment.bind(this, this.props.blogPostId, comment)} className='fa fa-times-circle deleteComment'/>
      <div>
        {
          this.webpage
          ? <a rel='extern nofollow' href={this.webpage} target='_blank'>
              <img src={this.gravatarHash} className='gravatar'/>
            </a> : <img src={this.gravatarHash} className='gravatar'/>
        }
      </div>
      <span>
      {
        this.webpage
        ? <a rel='external nofollow' href={this.webpage} target='_blank'>
            <span dangerouslySetInnerHTML={{__html: stripHTML(comment.name)}}/>
          </a> : <span dangerouslySetInnerHTML={{__html: stripHTML(comment.name)}}/>
      }
      </span>
      <span className='datePosted'>{this.datePostedOn}</span>
      <span> says: </span>
      <p className='comment-text' dangerouslySetInnerHTML={{__html: marked(this.body)}}/>
    </div>
  }
}

Comment.propTypes = { blogPostId: React.PropTypes.any, comment: React.PropTypes.object, reloadComments: React.PropTypes.func }

export class AddComment extends React.Component {
  constructor () {
    super()
    this.state = {
      showAddCommentForm: false
    }
  }

  onPostComment (e) {
    e.preventDefault()
    postComment(this.props.blogPostId, {
      name: ReactDOM.findDOMNode(this.refs.name).value,
      email: ReactDOM.findDOMNode(this.refs.email).value,
      webpage: ReactDOM.findDOMNode(this.refs.webpage).value,
      body: ReactDOM.findDOMNode(this.refs.body).value,
      captcha: ReactDOM.findDOMNode(this.refs.captcha).value
    }).then(() => {
      ReactDOM.findDOMNode(this.refs.name).value = ''
      ReactDOM.findDOMNode(this.refs.email).value = ''
      ReactDOM.findDOMNode(this.refs.webpage).value = ''
      ReactDOM.findDOMNode(this.refs.body).value = ''
      ReactDOM.findDOMNode(this.refs.captcha).value = ''
      this.refreshCaptcha()
      this.props.reloadComments()
      window.alert('Thank you, your comment was posted!')
    }).catch((statusCode) => {
      if (statusCode === 405) {
        // Captcha invalid show a captcha error
        ReactDOM.findDOMNode(this.refs.captcha).value = ''
        this.refreshCaptcha()
        window.alert('The captcha entered does not match what was expected! Please try again!')
      } else {
        console.error(`Blog post not posted, promise rejected with: ${statusCode}`)
        // Some kind of other error, show a generic posting error
        ReactDOM.findDOMNode(this.refs.captcha).value = ''
        this.refreshCaptcha()
        window.alert('There was an error posting the comment!')
      }
    })
  }

  refreshCaptcha () {
    fetchCaptcha(this.props.blogPostId)
      .then(captchaTextToDisplay => {
        console.log('captcha text to display: ', captchaTextToDisplay)
        this.setState({
          captchaTextToDisplay
        })
      }).catch((err) => {
        console.log('captcha text error: ', err)
      })
  }

  onClickAddComment () {
    this.refreshCaptcha()
    this.setState({
      showAddCommentForm: true
    })
  }
  render () {
    return <div>
      <input className={cx({
        hideAddCommentForm: this.state.showAddCommentForm
      })} type='button' value='Add a new comment' onClick={this.onClickAddComment.bind(this)} />
      <form className={cx({
        addCommentForm: true,
        hideAddCommentForm: !this.state.showAddCommentForm
      })} onSubmit={this.onPostComment.bind(this)}>
        <h2>Add a new comment</h2>
        <input ref='name' type='text' placeholder='Name' required />
        <input ref='email' type='email' placeholder='Email (Optional)' />
        <input ref='webpage' type='url' placeholder='Website (Optional)' />
        <textarea ref='body' placeholder='Your comment (markdown, but no tags)' required />
        <input className='captchaInput' ref='captcha' type='text' placeholder='Enter the numeric value of the number on the right' required />
        { !this.state.captchaTextToDisplay
          ? null : <span className='captchaText'>{this.state.captchaTextToDisplay}</span>
        }
        <input type='submit' value='Submit' />
      </form>
    </div>
  }
}

AddComment.propTypes = { blogPostId: React.PropTypes.any, reloadComments: React.PropTypes.func }
