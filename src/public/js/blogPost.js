import React from 'react';
import DocumentTitle from './documentTitle.js';
import {fetchBlogPost} from './fetch.js';
import * as Markdown from 'markdown';

export default class BlogPost extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentWillMount() {
    if (this.props.params && this.props.params.id) {
      fetchBlogPost(this.props.params.id).then((blogPost) =>
        this.setState({
          title: blogPost.title,
          body: blogPost.body,
          created: blogPost.created,
          tags: blogPost.tags,
        }));
    } else {
      this.state = {
        title: this.props.title,
        body: this.props.body,
        created: this.props.created,
        tags: this.props.tags,
      };
    }
  }

  render() {
    if (!this.state.title) {
      return null;
    }

    return <div>
      <DocumentTitle title='Blog Post'/>
      <div>{this.state.title}</div>
      <div>{this.state.created}</div>
      <div dangerouslySetInnerHTML={{__html: Markdown.markdown.toHTML(this.state.body)}}/>
    </div>;
  }
}
