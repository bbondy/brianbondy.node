import React from 'react';

export default class YearTag extends React.Component {
  get yearUrl() {
    return `/blog/posted/${this.props.year}`;
  }

  render() {
    return <a href={this.yearUrl} className='yearTag'>{this.props.year}</a>;
  }
}
