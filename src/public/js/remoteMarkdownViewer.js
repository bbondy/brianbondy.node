import React from 'react';
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
    fetchMarkdown(this.props.src).then((markdownText) =>
      this.setState({markdownText}));
  }
  render() {
     return <div dangerouslySetInnerHTML={{__html: Markdown.markdown.toHTML(this.state.markdownText)}}/>;
  }
}
