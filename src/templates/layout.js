import React from 'react'
import { Link } from 'gatsby'

import Header from '../components/header'

class Layout extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <div>{this.props.children}</div>
      </div>
    )
  }
}

export default Layout
