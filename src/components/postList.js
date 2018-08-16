import React from 'react'
import { Link, graphql } from 'gatsby'

import PostRow from './PostRow'
import Template from '../templates/layout'

const NavLink = props => {
  if (!props.test) {
    return <Link to={props.url}>{props.text}</Link>
  } else {
    return <span>{props.text}</span>
  }
}

class PostList extends React.Component {
  render() {
    const { title, pageContext } = this.props
    const { group, index, first, last, pageCount } = pageContext
    const previousUrl = index - 1 == 1 ? '' : (index - 1).toString()
    const nextUrl = (index + 1).toString()

    return (
      <Template>
        <h1>{title}</h1>
        {group.map(({ node }) => {
          return <PostRow key={node.fields.slug} node={node} />
        })}
        <div className="previousLink">
          <NavLink test={first} url={previousUrl} text="Go to Previous Page" />
        </div>
        <div className="nextLink">
          <NavLink test={last} url={nextUrl} text="Go to Next Page" />
        </div>
      </Template>
    )
  }
}

export default PostList
