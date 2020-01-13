import React from 'react'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'

import Header from 'components/header'
import Container from 'components/container'

import css from './layout.module.scss'
import 'css/highlight.scss';
import 'css/prism-solarizeddark.scss';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';

class Layout extends React.Component {
  render() {
    const { title, description } = this.props.data.site.siteMetadata
    return (
      <div>
        <Helmet
          defaultTitle={title}
          titleTemplate={`${title} | %s`}
        >
          <html lang="en" />
          <meta name="description" content={description} />
          <link href="https://fonts.googleapis.com/css?family=Roboto:400,400i,700|Roboto+Slab:700|Source+Code+Pro" rel="stylesheet" />
        </Helmet>
        <div className={css.headerContainer}>
          <Header  />
        </div>
        <Container>{this.props.children}</Container>
      </div>
    )
  }
}

export default props => (
  <StaticQuery
    query={graphql`
        query {
            site {
                siteMetadata {
                    title
                    description
                }
            }
        }
    `}
    render={data => <Layout data={data} {...props} />}
  />
)
