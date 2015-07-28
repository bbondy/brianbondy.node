import React from 'react';
import Router from 'react-router';

let RouteHandler = Router.RouteHandler;

export default class Blog extends React.Component {
  render() {
    return <div>
      <RouteHandler/>
    </div>;
  }
}
