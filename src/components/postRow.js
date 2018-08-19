import React from 'react'
import { Link } from 'gatsby'

import css from './postRow.module.scss';

class PostRow extends React.Component {
  render() {
    const { node } = this.props
    return (
      <div className={css.container}>
        <h3 className={css.title}>
          <Link to={node.fields.slug}>{node.frontmatter.title}</Link>
        </h3>
        <small>{node.frontmatter.date}</small>
        <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />
      </div>
    )
  }
}

export default PostRow
