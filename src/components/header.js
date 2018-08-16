import React from 'react'
import { Link } from 'gatsby'

class Header extends React.Component {
  render() {
    return (
      <div>
        <div>
          <Link to="/">guido.nyc</Link>
        </div>
        <div>
          <Link to="/about">/about</Link>
          <a href="https://github.com/gzzo">/github</a>
        </div>
      </div>
    )
  }
}

export default Header
