import React from 'react'

import css from './hero.module.scss'

class Hero extends React.Component {
  render() {
    return (
      <div className={css.hero}>
        <div className={css.title}>
          Hey, welcome to my blog.
        </div>
      </div>
    )
  }
}

export default Hero
