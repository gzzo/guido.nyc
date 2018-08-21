import React from 'react'
import _ from 'lodash'
import { graphql } from 'gatsby'

import Tags from 'components/tags'
import Layout from './layout'

import css from './post.module.scss'

class PostTemplate extends React.Component {
  render() {
    const post = _.get(this, 'props.data.markdownRemark')
    const { tags, date, title } = post.frontmatter;
    return (
      <Layout>
        <h1>{title}</h1>
        {date && <small>Published on {date}</small>}
        <div className={css.post} dangerouslySetInnerHTML={{ __html: post.html }} />
        {tags && <Tags tags={tags} />}
      </Layout>
    )
  }
}

export default PostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      excerpt
      html
      frontmatter {
        title
        tags
        date(formatString: "MMMM Do, YYYY")
      }
    }
  }
`
