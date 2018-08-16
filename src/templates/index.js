import React from 'react'
import { Link } from 'gatsby'

import PostRow from '../components/postRow'
import Template from '../templates/layout'

const NavLink = props => {
  if (!props.test) {
    return <Link to={props.url}>{props.text}</Link>
  } else {
    return <span>{props.text}</span>
  }
}

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
    const { group, index, first, last, pageCount } = this.props.pageContext
    const previousUrl = index - 1 == 1 ? '' : (index - 1).toString()
    const nextUrl = (index + 1).toString()

    return (
      <Template>
        <h1>{this.getTitle()}</h1>
        {group.map(({ node }) => {
          return <PostRow key={node.fields.slug} node={node} />
        })}
        <div className="previousLink">
          <NavLink test={first} url={previousUrl} text="Go to Previous Page" />
        </div>
        <div className="nextLink">
          <NavLink test={last} url={nextUrl} text="Go to Next Page" />
        </div>
      </Template>
    )
  }
}

export default Index
