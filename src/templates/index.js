import React from 'react'

import PostRow from 'components/postRow'
import Pagination from 'components/pagination'
import Layout from './layout'

import css from './index.module.scss'

class Index extends React.Component {
  getTitle() {
    const { groupType, tag } = this.props.pageContext.additionalContext
    if (groupType === 'index') {
      return 'Recent posts'
    } else if (groupType === 'tag') {
      return `Posts tagged with ${tag}`
    }
  }

  render() {
    const { group } = this.props.pageContext

    return (
      <Layout>
        <h1>{this.getTitle()}</h1>
        {group.map(({ node }) => {
          return <PostRow key={node.fields.slug} node={node} />
        })}
        <div className={css.paginationContainer}>
          <Pagination pageContext={this.props.pageContext} />
        </div>
      </Layout>
    )
  }
}

export default Index
