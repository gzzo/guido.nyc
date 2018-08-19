const _ = require('lodash')
const Promise = require('bluebird')
const path = require('path')

const { createFilePath } = require('gatsby-source-filesystem')
const createPaginatedPages = require('gatsby-paginate')


exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    const postTemplate = path.resolve('./src/templates/post.js')
    resolve(
      graphql(
        `
          {
            pages: allMarkdownRemark(
              sort: { fields: [frontmatter___date], order: DESC }
            ) {
              edges {
                node {
                  fields {
                    slug
                    collection
                  }
                  frontmatter {
                    title
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

        const posts = _.filter(result.data.pages.edges, page => {
          console.log(page.node)

          return page.node.fields.collection === 'posts'
        })

        // paginate posts
        createPaginatedPages({
          edges: posts,
          pathPrefix: '/posts',
          createPage: createPage,
          pageTemplate: 'src/templates/index.js',
          pageLength: 2,
          context: {
            groupType: 'index'
          }
        })

        // paginate tags
        const postsByTag = {};
        _.each(posts, post => {
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
            pageTemplate: 'src/templates/index.js',
            pageLength: 2,
            context: {
              groupType: 'tag',
              tag
            }
          })
        })

        // create all pages
        const pages = result.data.pages.edges;
        _.each(pages, (post, index) => {
          const previous = index === pages.length - 1 ? null : pages[index + 1].node
          const next = index === 0 ? null : pages[index - 1].node

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

  if (node.internal.type === 'MarkdownRemark') {
    createNodeField({
      node,
      name: 'slug',
      value: createFilePath({ node, getNode }),
    })

    createNodeField({
      node,
      name: 'collection',
      value: getNode(node.parent).sourceInstanceName,
    })
  }
}

exports.onCreateWebpackConfig = ({ stage, actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, "src"), "node_modules"],
    },
  })
}
