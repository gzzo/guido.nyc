import React from 'react';

import css from './container.module.css';


export default class Container extends React.Component {
  static defaultProps = {
    centered: false,
  }

  render() {
    let classes = ''
    if (this.props.centered) {
      classes = css.centered;
    }
    
    return (
      <div className={classes}>
        {this.props.children}
      </div>
    )
  }
}
