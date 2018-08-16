import React from 'react'
import { Link, graphql } from 'gatsby';
import get from 'lodash/get'

import Template from '../templates/layout'


const NavLink = props => {
  if (!props.test) {
    return <Link to={props.url}>{props.text}</Link>;
  } else {
    return <span>{props.text}</span>;
  }
};

class Tag extends React.Component {
  render() {
    console.log(this.props)
    const { group, index, first, last, pageCount, pathPrefix } = this.props.pageContext
    const previousUrl = pathPrefix + '/' + (index - 1 == 1 ? "" : (index - 1).toString())
    const nextUrl = pathPrefix + '/' + ((index + 1).toString())

    return (
      <Template>
        <h1>Recent posts</h1>
        {group.map(({node}) => {
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

export default Tag
