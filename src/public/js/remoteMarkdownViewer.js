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
  fetch() {
    let src = `${window.location.pathname.substring(1)}.markdown`;
    fetchMarkdown(src || this.props.src).then((markdownText) =>
      this.setState({markdownText}));
  }
  componentWillReceiveProps() {
    this.fetch();
  }
  componentWillMount() {
    this.fetch();
  }
  render() {
    return <div dangerouslySetInnerHTML={{
      __html: Markdown.markdown.toHTML(this.state.markdownText)
    }}/>;
  }
}
