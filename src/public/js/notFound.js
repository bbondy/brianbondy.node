import React from 'react';
import DocumentTitle from './documentTitle.js';
import {Link} from 'react-router';

export default class NotFound extends React.Component {
  render() {
    return <div className='notFoundPage'>
      <DocumentTitle title='Not Found'/>
      <h1>Not found</h1>
      The specified page was not found!  You could try <Link to='contact'>contacting</Link> me if you think it's an error.
    </div>;
  }
}
