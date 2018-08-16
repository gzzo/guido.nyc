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

class Index extends React.Component {
  render() {
    const { group, index, first, last, pageCount } = this.props.pageContext
    const previousUrl = index - 1 == 1 ? "" : (index - 1).toString()
    const nextUrl = (index + 1).toString()

    console.log(first, last, index, pageCount)

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

export default Index
