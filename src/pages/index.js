import React from 'react'
import { Link, graphql } from 'gatsby'

import Layout from 'templates/layout'
import PostRow from 'components/postRow'
import Hero from 'components/hero'
import CodeHeader from 'components/codeHeader'

const INDEX_NUM_POSTS = 3 // same as limit in query below

class Index extends React.Component {
  render() {
    const { totalCount, edges } = this.props.data.posts

    return (
      <Layout>
        <Hero />
        <CodeHeader code="ls -t posts/ | head -n 3">
          <h2>
            Recent posts
          </h2>
        </CodeHeader>
        {edges.map(({ node }) => {
          return <PostRow key={node.fields.slug} node={node} />
        })}
        {totalCount > INDEX_NUM_POSTS && (
          <Link to="/posts">
            <h5>See more posts</h5>
          </Link>
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
          excerpt(pruneLength: 250)
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM Do, YYYY")
            title
            tags
          }
        }
      }
    }
  }
`
