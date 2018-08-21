import React from 'react'
import { Link } from 'gatsby'

import Tags from './tags'

import css from './postRow.module.scss'

class PostRow extends React.Component {
  render() {
    const { node } = this.props
    return (
      <div className={css.container}>
        <h2 className={css.title}>
          <Link to={node.fields.slug}>## {node.frontmatter.title}</Link>
        </h2>
        <small className={css.date}>Published on {node.frontmatter.date}</small>
        <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />
        <Tags tags={node.frontmatter.tags} />
        <Link to={node.fields.slug}>less</Link>
      </div>
    )
  }
}

export default PostRow
