import React from 'react'

export default class NavigationButton extends React.Component {
  render () {
    return <a href={this.props.src}><span className='navigationButton'>{this.props.text}</span></a>
  }
}
NavigationButton.propTypes = { src: React.PropTypes.string, text: React.PropTypes.string }
