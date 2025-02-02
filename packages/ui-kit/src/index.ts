import * as designSystem from './design-system';
import * as Markdown from './components/markdown';

// components that are not part of the "Markdown" export:
export { designSystem, Markdown };
export { default as ContentNotifications } from './components/content-notifications';
export { default as RssFeeds } from './components/rss/rss-feeds';
export { default as Globals } from './components/globals';
export { default as Link } from './components/link';
export { default as LogoButton } from './components/logo-button';
export { default as MediaQuery } from './components/media-query';
export {
  default as MultiCodeBlock,
  MultiCodeBlockMarkdownWrapper,
} from './components/multi-code-block';
export { default as CodeBlock } from './components/code-block';
export { default as Reset } from './components/reset';
export { default as Subtitle } from './components/subtitle';
export { default as TextSmall } from './components/text-small';
export { default as Mermaid } from './components/mermaid';

// style blocks for components to be composed to components with functionality
export * as cardElements from './components/card-elements';

// icons
export * as Icons from './icons';

// utils
export { default as createStyledIcon } from './utils/create-styled-icon';
export { default as SafeHTMLElement } from './utils/safe-html-element';
export { parseIsoDate, IsoDateFormat, DocsDateFormat } from './utils/dates';
export { default as markdownFragmentToReact } from './utils/markdown-fragment-to-react';

// hooks
export { default as useISO310NumberFormatter } from './hooks/use-iso310-number-formatter';
