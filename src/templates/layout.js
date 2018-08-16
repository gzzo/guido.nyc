import React from 'react'
import { Link } from 'gatsby'

import Header from 'components/header'
import Container from 'components/container'

class Layout extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Container>{this.props.children}</Container>
      </div>
    )
  }
}

export default Layout
