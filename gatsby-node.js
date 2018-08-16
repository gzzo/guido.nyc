const _ = require('lodash')
const Promise = require('bluebird')
const path = require('path')

const { createFilePath } = require('gatsby-source-filesystem')
const createPaginatedPages = require("gatsby-paginate")


exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    const postTemplate = path.resolve('./src/templates/post.js')
    resolve(
      graphql(
        `
          {
            pages: allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
              edges {
                node {
                  fields {
                    slug
                  }
                  frontmatter {
                    title
                    type
                    tags
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }

        const filteredPages = _.filter(result.data.pages.edges, post => post.node.frontmatter.type !== 'page')

        // paginate posts
        createPaginatedPages({
          edges: filteredPages,
          createPage: createPage,
          pageTemplate: "src/templates/index.js",
          pageLength: 2,
          context: {}
        })

        // paginate tags
        const postsByTag = {};
        _.each(filteredPages, post => {
          const {tags} = post.node.frontmatter;

          if (!tags) {
            return
          }

          _.each(tags, tag => {
            if (postsByTag[tag] === undefined) {
              postsByTag[tag] = [post]
            } else {
              postsByTag[tag].push(post)
            }
          })
        })

        _.each(postsByTag, (posts, tag) => {
          createPaginatedPages({
            edges: posts,
            pathPrefix: tag,
            createPage: createPage,
            pageTemplate: "src/templates/tag.js",
            pageLength: 2,
            context: {
              tag
            }
          })
        })

        // create all pages
        const posts = result.data.pages.edges;
        _.each(posts, (post, index) => {
          const previous = index === posts.length - 1 ? null : posts[index + 1].node
          const next = index === 0 ? null : posts[index - 1].node

          createPage({
            path: post.node.fields.slug,
            component: postTemplate,
            context: {
              slug: post.node.fields.slug,
              previous,
              next,
            },
          })
        })
      })
    )
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
