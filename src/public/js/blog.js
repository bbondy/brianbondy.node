import React from 'react';
import Router from 'react-router';
import DocumentTitle from './documentTitle.js';

let RouteHandler = Router.RouteHandler;

export default class Blog extends React.Component {
  render() {
    return <div>
      <DocumentTitle title='Blog Posts'/>
      <RouteHandler/>
    </div>;
  }
}
