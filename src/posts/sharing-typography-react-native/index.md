---
title: Sharing Typography with React Across Web and Mobile
date: '2020-03-25'
tags: ['react', 'css']
---

## Introduction

Sharing components across React and React Native can be difficult, especially for layout components. Sometimes the best
we can do is HOCs that cover the functionality and separate components across each platform that render the appropriate
layouts. 

It's especially difficult with style, since we tend to keep style in CSS which isn't possible with React Native. If you
read my previous post about [`sass-vars-loader`](/posts/favorite-sass-vars-loader), you know that sharing styling
constants is not only possible, but fairly easy. In this post we'll take that concept a step further and create
typography components that are consistent across web and mobile.

## Laying the groundwork

Let's start with a set of typography definitions that you might have in a style guide.

```js
// constants/typography.js
module.exports = {
  baseTypography: {
    header1: {
      'font-size': '24px',
      'line-height': '32px',
    },
    header2: {
      'font-size': '20px',
      'line-height': '28px',
    },
    header3: {
      'font-size': '18px',
      'line-height': '24px',
      'font-weight': '700',
    },
  },
}
```

Using `sass-vars-loader`, you should load this file in your webpack config.

## Desktop

Now we'll create CSS class definitions from these constants and create an HOC for our basic typography component.

### The CSS

```scss
// typography/typography.scss
@mixin declareFromObject($object) {
  @each $key, $value in $object {
    #{$key}: $value;
  }
}

@each $className, $textStyle in $baseTypography {
  .#{$className} {
    @include declareFromObject($textStyle);
  }
}
```

That's it! SCSS is super powerful. Read more about [mixins](https://sass-lang.com/documentation/at-rules/mixin), 
[each](https://sass-lang.com/documentation/at-rules/control/for), 
and [interpolation](https://sass-lang.com/documentation/interpolation).

### The HOC

```js
// typography/index.js
import React from 'react'
import classNames from 'classnames'
import _ from 'lodash'

import css from './typography.scss'

const fromStyle = styleName => {
  class Typography extends React.Component {
    static displayName = _.upperFirst(styleName)

    static defaultProps = {
      Component: 'div',
    }

    render() {
      const {
        children,
        Component,
        className,
        forwardedRef,
        ...innerProps
      } = this.props


      const classes = classNames(css[styleName], className)

      return (
        <Component className={classes} ref={forwardedRef} {...innerProps}>
          {children}
        </Component>
      )
    }
  }

  return React.forwardRef((props, ref) => {
    return <Typography {...props} forwardedRef={ref} />
  })
}

const Header1 = fromStyle('header1')
const Header2 = fromStyle('header2')
const Header3 = fromStyle('header3')

export { Header1, Header2, Header3 }
```

> It's possible to dynamically create and export the individual typography components for each style, but there are 
> tradeoffs with each approach. I prefer having the code completion that you get with the static approach.

## Mobile

In React Native, we don't need to create any CSS. We'll just import the constant file directly and parse the values
since there are no pixel units in RN.

```js
// typography/index.js
import React from 'react'
import _ from 'lodash'
import { Text } from 'react-native'

import { baseTypography } from 'constants/typography'

const parseValue = value => {
  if (_.endsWith(value, 'px')) {
    return parseFloat(value.replace('px', ''))
  }

  return value
}

const transformStyle = style => {
  return _.mapValues(_.mapKeys(style, (val, key) => _.camelCase(key)), parseValue)
}

const fromStyle = styleName => {
  class Typography extends React.Component {
    static displayName = _.upperFirst(styleName)

    render() {
      const { children, forwardedRef, style, ...innerProps } = this.props

      const styles = [transformStyle(baseTypography[styleName]), style]

      return (
        <Text style={styles} ref={forwardedRef} {...innerProps}>
          {children}
        </Text>
      )
    }
  }

  return React.forwardRef((props, ref) => {
    return <Typography {...props} forwardedRef={ref} />
  })
}

const Header1 = fromStyle('header1')
const Header2 = fromStyle('header2')
const Header3 = fromStyle('header3')

export { Header1, Header2, Header3 }
```

## Conclusion

As you can see, the Typography components we end up with across web and mobile are pretty similar. You can take this
concept further with separate desktop and mobile typography, using media queries on the desktop CSS and having the
mobile typography take preference in RN.