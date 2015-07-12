import React from 'react';
import Router from 'react-router';

let RouteHandler = Router.RouteHandler;

export default class Main extends React.Component {
  render() {
    return (
      <div>
        <h1>App</h1>
        <RouteHandler/>
      </div>
    )
  }
}
