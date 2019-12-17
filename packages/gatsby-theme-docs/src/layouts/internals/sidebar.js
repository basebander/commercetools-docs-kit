import React from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql, Link } from 'gatsby';
import { css, ClassNames } from '@emotion/core';
import styled from '@emotion/styled';
import SpacingsStack from '@commercetools-uikit/spacings-stack';
import { designSystem } from '@commercetools-docs/ui-kit';
import { BetaFlag } from '../../components';

const trimTrailingSlash = url => url.replace(/(\/?)$/, '');

const SidebarWebsiteTitle = styled.div`
  color: ${designSystem.colors.light.primary};
  padding: ${designSystem.dimensions.spacings.l}
    ${designSystem.dimensions.spacings.m};
  font-size: ${designSystem.typography.fontSizes.h4};
`;
const SidebarLinkTitle = styled.div`
  font-size: ${designSystem.typography.fontSizes.body};
  text-overflow: ellipsis;
  overflow-x: hidden;
  width: 100%;
`;
const SidebarLinkSubtitle = styled.div`
  font-size: ${designSystem.typography.fontSizes.small};
  text-overflow: ellipsis;
  overflow-x: hidden;
  width: 100%;
`;
const SidebarLinkItem = styled.div`
  padding: 0 0 0 ${designSystem.dimensions.spacings.m};
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;

const SidebarLink = props => (
  <ClassNames>
    {({ css: makeClassName }) => {
      const linkClassName = makeClassName`
        border-left: ${designSystem.dimensions.spacings.xs} solid
          ${designSystem.colors.light.surfaceSecondary1};
        padding-left: calc(
          ${designSystem.dimensions.spacings.m} - ${designSystem.dimensions.spacings.xs}
        );
        text-decoration: none;
        color: ${designSystem.colors.light.textSecondary};
        display: flex;
        flex-direction: row;
        align-items: flex-end;

        :hover {
          color: ${designSystem.colors.light.linkNavigation} !important;
        }

        > * + * {
          margin: 0 0 0 ${designSystem.dimensions.spacings.s};
        }
      `;
      const activeClassName = makeClassName`
        border-left: ${designSystem.dimensions.spacings.xs} solid ${designSystem.colors.light.linkNavigation} !important;
        color: ${designSystem.colors.light.linkNavigation} !important;
      `;
      return (
        <Link
          {...props}
          // eslint-disable-next-line react/prop-types
          to={trimTrailingSlash(props.to)}
          getProps={({ href, location }) => {
            // Manually check that the link is the active one, even with trailing slashes.
            // The gatsby link is by default configured to match the exact path, therefore we
            // need to check this manually.
            const linkPath = trimTrailingSlash(href);
            const locationPath = trimTrailingSlash(location.pathname);
            if (linkPath === locationPath) {
              return { className: [linkClassName, activeClassName].join(' ') };
            }
            return { className: linkClassName };
          }}
        />
      );
    }}
  </ClassNames>
);
SidebarLink.displayName = 'SidebarLink';

const Sidebar = props => {
  const data = useStaticQuery(graphql`
    query SidebarQuery {
      allNavigationYaml {
        nodes {
          chapterTitle
          beta
          pages {
            title
            path
            beta
          }
        }
      }
    }
  `);
  return (
    <nav
      aria-label="Main navigation"
      css={css`
        width: 100%;
        > * + * {
          border-top: 1px solid ${designSystem.colors.light.borderPrimary};
          margin-right: ${designSystem.dimensions.spacings.m};
          padding: ${designSystem.dimensions.spacings.l} 0;
        }
      `}
    >
      <SidebarWebsiteTitle>
        <SpacingsStack scale="xs">
          <div>{props.isGlobalBeta && <BetaFlag />}</div>
          <Link
            to="/"
            css={css`
              text-decoration: none;
              color: ${designSystem.colors.light.primary};
              :hover {
                text-decoration: underline;
              }
            `}
          >
            {props.siteTitle}
          </Link>
        </SpacingsStack>
      </SidebarWebsiteTitle>
      {data.allNavigationYaml.nodes.map((node, index) => (
        <SpacingsStack scale="s" key={index}>
          <SidebarLinkItem>
            <SidebarLinkTitle>{node.chapterTitle}</SidebarLinkTitle>
            {node.beta && !props.isGlobalBeta && <BetaFlag />}
          </SidebarLinkItem>
          <SpacingsStack scale="s">
            {node.pages &&
              node.pages.map((pageLink, pageIndex) => (
                <SidebarLink
                  to={pageLink.path}
                  key={`${index}-${pageIndex}-${pageLink.path}`}
                  onClick={props.onLinkClick}
                >
                  <SidebarLinkSubtitle>{pageLink.title}</SidebarLinkSubtitle>
                  {pageLink.beta && !props.isGlobalBeta && <BetaFlag />}
                </SidebarLink>
              ))}
          </SpacingsStack>
        </SpacingsStack>
      ))}
    </nav>
  );
};
Sidebar.displayName = 'Sidebar';
Sidebar.propTypes = {
  onLinkClick: PropTypes.func.isRequired,
  slug: PropTypes.string.isRequired,
  siteTitle: PropTypes.string.isRequired,
  isGlobalBeta: PropTypes.bool.isRequired,
};

export default Sidebar;
