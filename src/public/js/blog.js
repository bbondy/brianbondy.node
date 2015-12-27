import React from 'react'

export default class Blog extends React.Component {
  render () {
    return <div>
      {this.props.children}
    </div>
  }
}

Blog.propTypes = { children: React.PropTypes.any }
