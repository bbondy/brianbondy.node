import React from 'react';
import * as Immutable from 'immutable';
import Tag from './tag.js';
import YearTag from './yearTag.js';
import {fetchTags} from './fetch.js';

export default class BlogFilters extends React.Component {
  constructor() {
    super();
    this.state = {
      tags: [],
    };
  }

  componentWillMount() {
    fetchTags().then((tags) => {
      this.setState({
        tags,
      });
    });
  }

  render() {
    return <div>
      <h1>Blog posts by year</h1>
      {new Immutable.Range(new Date().getFullYear(), 2005, -1)
        .map(year => <YearTag year={year}/>).toJS()}
      <h1>Blog posts by tag</h1>
      <div className='tagContainer'>
      {this.state.tags
        .map(tag => <div> <Tag name={tag.name}/> x {tag.count}</div>)}
      </div>
    </div>;
  }
}
