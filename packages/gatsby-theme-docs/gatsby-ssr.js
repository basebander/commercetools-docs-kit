/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */
import React from 'react';
import { renderToString } from 'react-dom/server';
import { withPrefix } from 'gatsby';
// NOTE: prefer importing specific module (https://github.com/gatsbyjs/gatsby/pull/35985)
// This might be related to the error `Reading from "bun:ffi" is not handled by plugins (Unhandled scheme)`.
import { createContentDigest } from 'gatsby-core-utils/dist/create-content-digest';
import createEmotionServer from '@emotion/server/create-instance';
import { CacheProvider } from '@emotion/react';
import { createDocsCache, docsCacheKey } from './utils/create-emotion-cache';
// eslint-disable-next-line import/no-webpack-loader-syntax
import iconDarkDigestRaw from '!!raw-loader!./static/favicon-dark-32x32.png';
// eslint-disable-next-line import/no-webpack-loader-syntax
import iconLightDigestRaw from '!!raw-loader!./static/favicon-light-32x32.png';

const iconDarkDigest = createContentDigest(iconDarkDigestRaw);
const iconLightDigest = createContentDigest(iconLightDigestRaw);

// There is a known issue with Emotion and SSR in case elements use
// nth child selectors, like the Lobotomized Owl (`* + *`).
// This causes a FOUC effect (Flash Of Unstyled Content), where the injected
// inline <style> element disrupts the CSS selector until it gets removed
// upon hydration on the client side.
// https://github.com/emotion-js/emotion/issues/1178
// Until this issue is solved, we need to find a way to exclude the <style>
// element to affect the styles of the CSS selector.
// I found the following modified Lobotomized Owl selector to work.
// It uses the "general sibling selector (~)" instead of the "adjacent sibling
// selector (+)" together with the `:not` psuedo-class to exclude the `style` elements.
// The "hack" is to replace all the normal Lobotomized Owl selector with the new one.
const patchedLobotomizedOwlSelector = '> *:not(style) ~ *:not(style)';
const lobotomizedOwlSelectorRegex = />\s*\*\s*\+\s*\*/g;

export const replaceRenderer = ({
  bodyComponent,
  replaceBodyHTMLString,
  setHeadComponents,
}) => {
  // https://emotion.sh/docs/ssr#on-server
  // https://emotion.sh/docs/ssr#gatsby
  const cache = createDocsCache();
  const { extractCritical } = createEmotionServer(cache);
  const { html, css, ids } = extractCritical(
    renderToString(<CacheProvider value={cache}>{bodyComponent}</CacheProvider>)
  );

  const patchedHtml = html
    // https://emmenko.medium.com/patching-lobotomized-owl-selector-for-emotion-ssr-5a582a3c424c
    .replace(lobotomizedOwlSelectorRegex, patchedLobotomizedOwlSelector);
  const patchedCss = css
    // https://emmenko.medium.com/patching-lobotomized-owl-selector-for-emotion-ssr-5a582a3c424c
    .replace(lobotomizedOwlSelectorRegex, patchedLobotomizedOwlSelector);

  replaceBodyHTMLString(patchedHtml);
  setHeadComponents([
    <link
      key="favicon-dark"
      rel="icon"
      href={withPrefix(`favicon-dark-32x32.png?v=${iconDarkDigest}`)}
      media="(prefers-color-scheme:light)"
    />,
    <link
      key="favicon-light"
      rel="icon"
      href={withPrefix(`favicon-light-32x32.png?v=${iconLightDigest}`)}
      media="(prefers-color-scheme:dark)"
    />,
    <style
      key="emotion-ssr"
      data-emotion={`${docsCacheKey} ${ids.join(' ')}`}
      dangerouslySetInnerHTML={{
        __html: patchedCss,
      }}
    />,
  ]);
};
