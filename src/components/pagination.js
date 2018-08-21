import React from 'react'
import { Link } from 'gatsby'

import css from './pagination.module.scss'

const NavLink = props => {
  if (!props.test) {
    return <Link to={props.url}>{props.text}</Link>
  } else {
    return <div>{props.text}</div>
  }
}

class Pagination extends React.Component {
  render() {
    const { index, first, last, pageCount, pathPrefix } = this.props.pageContext

    if (pageCount === 1) {
      return null;
    }

    const previousPage = index - 1 === 1 ? '' : (index - 1)
    const nextPage = index + 1

    const previousUrl = `${pathPrefix}/${previousPage}`
    const nextUrl = `${pathPrefix}/${nextPage}`

    return (
      <div className={css.pagination}>
        <div className={css.previousLink}>
          <NavLink test={first} url={previousUrl} text="Previous page" />
        </div>
        <div>
          <NavLink test={last} url={nextUrl} text="Next page" />
        </div>
      </div>
    )
  }
}

export default Pagination
