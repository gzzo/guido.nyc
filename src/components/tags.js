import React from 'react'
import { Link } from 'gatsby'

import CodeHeader from './codeHeader'

import css from './tags.module.scss'

class Tags extends React.Component {
  render() {
    const { tags } = this.props;
    return (
      <div className={css.container}>
        <CodeHeader code="cat tags">
          <h4 className={css.title}>
            Tagged with
          </h4>
        </CodeHeader>
        {tags.map(tag => {

          return (
            <Link to={`/tag/${tag}`} key={tag} className={css.tag}>
              {tag}
            </Link>
          )
        })}
      </div>
    )
  }
}

export default Tags
