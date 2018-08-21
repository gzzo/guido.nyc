import React from 'react'

import css from './container.module.scss'

class Container extends React.Component {
  render() {
    return <div className={css.container}>{this.props.children}</div>
  }
}

export default Container
