module.exports = {
  siteMetadata: {
    title: 'guido.nyc',
    author: 'Guido Rainuzzo',
    description: 'A blog by Guido',
    siteUrl: 'https://www.guido.nyc',
  },
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/posts`,
        name: 'posts',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages',
      },
    },
    {
      resolve: 'gatsby-plugin-page-creator',
      options: {
        path: `${__dirname}/src/pages`,
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: 'gatsby-remark-responsive-iframe',
            options: {
              wrapperStyle: 'margin-bottom: 1.0725rem',
            },
          },
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              showLineNumbers: true
            }
          },
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
          'gatsby-remark-autolink-headers',
          'gatsby-remark-external-links'
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-sass',
      options: {
        includePaths: [`${__dirname}/src/css`],
      },
    },
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-123955635-1',
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-remove-trailing-slashes',
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'guido.nyc',
        short_name: 'guido.nyc',
        start_url: `/`,
        background_color: `#F9F7C0`,
        theme_color: `#ED6A5A`,
        display: `minimal-ui`,
        icon: `src/images/icon.png`, // This path is relative to the root of the site.
      },
    },

    // needs to be after manifest
    'gatsby-plugin-offline',

    // needs to be last
    'gatsby-plugin-netlify'
  ],
};
