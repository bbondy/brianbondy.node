import React from 'react';
import {fetchMarkdown} from './client.js';
import marked from './marked';
import externalLinkSetup from './externalLinkSetup.js';

export default class About extends React.Component {
  constructor() {
    super();
    this.state = {
      markdownText: ''
    };
  }
  get pageTitle() {
    return {
      '/blog/filters': 'Blog Filters'
    }[window.location.pathname];
  }
  fetch() {
    let src = `${window.location.pathname.substring(1)}.markdown`;
    (this.props.fetchFunc || fetchMarkdown)(this.props.src || src).then((markdownText) =>
      this.setState({markdownText}));
  }
  componentWillReceiveProps() {
    this.fetch();
  }
  componentWillMount() {
    this.fetch();
  }
  componentDidUpdate() {
    externalLinkSetup(React.findDOMNode(this.refs.markdownContainer));
  }
  render() {
    return <div>
      <div ref='markdownContainer' dangerouslySetInnerHTML={
        {__html: marked(this.state.markdownText)}}/></div>;
  }
}
