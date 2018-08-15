import React from 'react'
import { Link, graphql } from 'gatsby';
import get from 'lodash/get'

import Template from '../templates/layout'

class Index extends React.Component {
  render() {
    const posts = get(this, 'props.data.allMarkdownRemark.edges')

    return (
      <Template>
        <h1>Recent posts</h1>
        {posts.map(({node}) => {
          return (
            <div key={node.fields.slug}>
              <h4>
                <Link to={node.fields.slug}>
                  {node.frontmatter.title}
                </Link>
              </h4>
              <small>
                {node.frontmatter.date}
              </small>
              <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />
            </div>
          )
        })}
      </Template>
    )
  }
}

export default Index

export const pageQuery = graphql`
    query IndexQuery {
        site {
            siteMetadata {
                title
            }
        }
        allMarkdownRemark(
            sort: { fields: [frontmatter___date], order: DESC },
            filter: { fields: {slug: {ne: "/404/"}} },
            limit: 3
        ) {
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
