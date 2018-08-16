import React from 'react'
import { Link } from 'gatsby'

class PostRow extends React.Component {
  render() {
    const { node } = this.props

    return (
      <div>
        <h4>
          <Link to={node.fields.slug}>{node.frontmatter.title}</Link>
        </h4>
        <small>{node.frontmatter.date}</small>
        <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />
      </div>
    )
  }
}

export default PostRow
