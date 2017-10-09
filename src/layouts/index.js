import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'

import './index.css'

const TemplateWrapper = ({ children }) => (
  <div>
    <Helmet>
     <title>guido.nyc</title>
     <link href="https://fonts.googleapis.com/css?family=Bungee+Shade|Codystar" rel="stylesheet" />
    </Helmet>
    <div>
      {children()}
    </div>
  </div>
)

export default TemplateWrapper
