import React from 'react'
import { Link, graphql } from 'gatsby'

import Layout from 'templates/layout'
import PostRow from 'components/postRow'
import Hero from 'components/hero'
import CodeHeader from 'components/codeHeader'

class Index extends React.Component {
  render() {
    console.log(this.props)
    const { totalCount, edges } = this.props.data.posts
    const numEdges = edges.length

    return (
      <Layout>
        <Hero />
        <CodeHeader code={`ls -t posts/ | head -n ${numEdges}`}>
          <h2>
            Recent posts
          </h2>
        </CodeHeader>
        {edges.map(({ node }) => {
          return <PostRow key={node.fields.slug} node={node} />
        })}
        {totalCount > numEdges && (
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
      limit: 5
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
