import React from 'react';
import { ThemeProvider } from 'styled-components';

import { BreakpointProvider } from '../components/Media';
import Layout from '../components/layout/Layout';
import SEO from '../components/Seo';

import theme from '../theme';

const NAV_LIGHT = 'Light';

const NotFoundPage = () => (
  <ThemeProvider theme={theme}>
    <BreakpointProvider>
      <Layout
        navAppearance={{
          initial: NAV_LIGHT,
          onScroll: NAV_LIGHT,
        }}
      >
        <SEO title="404: Not found" />
        <h1>Not Found</h1>
        <p>You just hit a route that doesn&#39;t exist&hellip; the sadness.</p>
      </Layout>
    </BreakpointProvider>
  </ThemeProvider>
);

export default NotFoundPage;
