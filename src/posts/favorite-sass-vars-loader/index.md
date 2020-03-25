---
title: "Favorite libraries: sass-vars-loader"
date: '2020-03-24'
tags: ['react', 'css']
---

## Introduction

One of my favorites libraries for React is [`sass-vars-loader`](https://github.com/epegzz/sass-vars-loader).
The use-case is pretty simple: I want constants that are accessible by both SCSS and JS.

Say you have a file called `colors.scss` that holds the colors for your style guide:

```scss
$colorBlue: #011627;
$colorGreen: #2EC4B6;
$colorRed: #E71D36;
$colorOrange: #FF9F1C;
```

You import this file across the rest of your SCSS to keep your style consistent and everything works great.
That is, until you need to access these constants from JS.

> There are plenty of reasons why you might need to access style constants in JS! 
> For example, React Native's Stylesheet component can't load CSS. Or you might use a third party component that can 
> only be styled with CSS-in-JS instead of CSS modules. Maybe you want to make some calculations in JS land based on
> the value of a constant you also need in CSS.

So what do you do? You know how painful it would be to duplicate this constant in a JS file.
What if you forget to update both files at once?

## Using the library

This is where `sass-vars-loader` comes in. 

### 1. Change your `colors.scss` to `colors.js`:

```js
module.exports = {
  colorBlue: "#011627",
  colorGreen: "#2EC4B6",
  colorRed: "#E71D36",
  colorOrange: "#FF9F1C",
}
```

### 2. Add `sass-vars-loader` to your webpack rules:

```js
{
  loader: '@epegzz/sass-vars-loader',
  options: {
    syntax: 'scss',
    files: [
      path.resolve(__dirname, '../src/constants/colors.js'),
    ],
  },
}
```

### 3. Access your constants

In JS you can import the file as you would any other file and have access to the constants.

In SCSS the variables will be loaded into every SCSS file, so with our example above, we can do stuff like:

```scss
.logo {
  color: $colorBlue;
}
```

## Example use case

In the next post, [Sharing Typography with React Across Web and Mobile](/posts/sharing-typography-react-native), we'll
use this library and some awesome SCSS features to create components from typography constants.
