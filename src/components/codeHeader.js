import React from 'react'

import css from './codeHeader.module.scss'

class CodeHeader extends React.Component {
  render() {
    return (
      <div className={css.container}>
        <div className={css.header}>
          {this.props.children}
        </div>
        <div className={css.code}>
          > $ {this.props.code}
        </div>
      </div>
    )
  }
}

export default CodeHeader
