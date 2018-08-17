import React from 'react'
import { Link } from 'gatsby'

import Container from './container'
import typography from 'utils/typography'

import css from './header.module.scss'

class Header extends React.Component {
  render() {
    return (
      <div
        className={css.header}
        style={{
          marginBottom: typography.rhythm(1),
          marginTop: typography.rhythm(1),
          paddingTop: typography.rhythm(1 / 2),
          paddingBottom: typography.rhythm(1 / 2),
        }}
      >
        <Container>
          <div>
            <Link to="/">guido.nyc</Link>
          </div>
          <div>
            <Link to="/about">/about</Link>
            <Link to="/posts">/posts</Link>
            <a href="https://github.com/gzzo" target="_blank">
              /github
            </a>
          </div>
        </Container>
      </div>
    )
  }
}

export default Header
