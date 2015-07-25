import React from 'react';
import {fetchMarkdown} from './fetch.js';
import marked from './marked';

export default class About extends React.Component {
  constructor() {
    super();
    this.state = {
      markdownText: ''
    };
  }
  fetch() {
    let src = `${window.location.pathname.substring(1)}.markdown`;
    fetchMarkdown(this.props.src || src).then((markdownText) =>
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
      __html: marked(this.state.markdownText)
    }}/>;
  }
}
