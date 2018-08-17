import React from 'react'
import _ from 'lodash'
import { graphql } from 'gatsby'

import Layout from './layout'

class PostTemplate extends React.Component {
  render() {
    const post = _.get(this, 'props.data.markdownRemark')
    return (
      <Layout>
        <h1>{post.frontmatter.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
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
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`
