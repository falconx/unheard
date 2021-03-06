require('dotenv').config();

module.exports = {
  siteMetadata: {
    title: 'Unheard',
    description: '',
    author: 'Luke Burroughs',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-styled-components',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`,
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
      resolve: 'gatsby-source-wordpress',
      options: {
        baseUrl: process.env.WORDPRESS_BASE_URL,
        protocol: process.env.WORDPRESS_PROTOCOL,
        hostingWPCOM: (process.env.WORDPRESS_HOSTING_WPCOM === 'true'),
        useACF: (process.env.WORDPRESS_USE_ACF === 'true'),
        verboseOutput: (process.env.WORDPRESS_VERBOSE_OUTPUT === 'true'),
        auth: {
          wpcom_app_clientSecret: process.env.WORDPRESS_CLIENT_SECRET,
          wpcom_app_clientId: process.env.WORDPRESS_CLIENT_ID,
          wpcom_user: process.env.WORDPRESS_USER,
          wpcom_pass: process.env.WORDPRESS_PASSWORD,
        },
        excludedRoutes: ["**/settings", "**/themes", "**/users/me"],
      },
    },
    {
      resolve: 'gatsby-plugin-sharp',
      options: {
        // https://www.gatsbyjs.org/packages/gatsby-plugin-sharp/#using-mozjpeg
        // useMozJpeg: true,
        stripMetadata: true,
        defaultQuality: 100,
      },
    },
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Unheard',
        short_name: 'Unheard',
        start_url: '/',
        background_color: '#e677ad',
        theme_color: '#e677ad',
        display: 'minimal-ui',
        // icon: "src/images/gatsby-icon.png", // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.app/offline
    // "gatsby-plugin-offline",
    // "gatsby-transformer-remark",
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 1620,
              quality: 100,
              loading: 'lazy',
            },
          },
          'gatsby-remark-copy-linked-files',
        ],
      },
    },
  ],
}
