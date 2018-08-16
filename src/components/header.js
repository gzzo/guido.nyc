import React from 'react'
import { Link } from 'gatsby'

import Container from './container'

class Header extends React.Component {
  render() {
    return (
      <div>
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
