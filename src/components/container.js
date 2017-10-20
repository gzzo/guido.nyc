import React from 'react';
import classNames from 'classnames';

import css from './container.module.css';


export default class Container extends React.Component {
  render() {
    const classes = classNames({
      [css.centered]: this.props.centered,
      [css.fullscreen]: this.props.fullscreen,
    });

    return (
      <div className={classes}>
        {this.props.children}
      </div>
    )
  }
}
