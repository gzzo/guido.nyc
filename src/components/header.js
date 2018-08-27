import React from 'react'
import { Link } from 'gatsby'

import Container from './container'

import css from './header.module.scss'

class Header extends React.Component {
  render() {
    return (
      <div className={css.header}>
        <Container>
          <div className={css.menuContainer}>
            <Link to="/" className={css.logo}>
              guido.nyc
            </Link>
            <div className={css.rightLinks}>
              <Link to="/about">/about</Link>
              <Link to="/posts">/posts</Link>
              <a href="https://github.com/gzzo" target="_blank" rel="noopener">
                /github
              </a>
            </div>
          </div>
        </Container>
      </div>
    )
  }
}

export default Header
