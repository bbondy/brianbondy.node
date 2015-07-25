import React from 'react';

export default class NavigationButton {
  render() {
    return <a href={this.props.src}><span className='navigationButton'>{this.props.text}</span></a>;
  }
}
