import React from 'react'
import Helmet from 'react-helmet'

import css from './index.css'

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
