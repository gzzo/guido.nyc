import React from 'react'
import { Link, graphql } from 'gatsby'

import Layout from 'templates/layout'
import PostRow from 'components/postRow'

const INDEX_NUM_POSTS = 3 // same as limit in query below

class Index extends React.Component {
  render() {
    const { totalCount, edges } = this.props.data.posts

    return (
      <Layout>
        <div>hero</div>
        <h1>Recent posts</h1>
        {edges.map(({ node }) => {
          return <PostRow key={node.fields.slug} node={node} />
        })}
        {totalCount > INDEX_NUM_POSTS && (
          <Link to="/posts">See more posts</Link>
        )}
      </Layout>
    )
  }
}

export default Index

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    posts: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fields: { collection: { eq: "posts" } } }
      limit: 3
    ) {
      totalCount
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "DD MMMM, YYYY")
            title
          }
        }
      }
    }
  }
`
