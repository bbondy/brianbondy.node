import React from 'react';
import DocumentTitle from './documentTitle.js';
import {fetchMarkdown} from './fetch.js';
import * as Markdown from 'markdown';

export default class About extends React.Component {
  constructor() {
    super();
    this.state = {
      markdownText: ''
    };
  }
  componentWillMount() {
    fetchMarkdown('about.markdown').then((markdownText) =>
      this.setState({markdownText}));
  }
  render() {
    return <div>
      <DocumentTitle title='About'/>
      <div dangerouslySetInnerHTML={{__html: Markdown.markdown.toHTML(this.state.markdownText)}}/>
    </div>;
  }
}
