import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const LIGHT = 'light';
const DARK = 'dark';

const NavList = styled.ul`
  display: flex;
`;

const NavListItem = styled.li`
  & + & {
    margin-left: 90px;
  }
`;

const NavLink = styled.a.attrs(props => ({
  title: props.children,
}))`
  position: relative;
  border-bottom: 1px solid transparent;
  color: ${props => props.theme.colors.steal};

  /* wait until the sticky menu is off-screen before switching colour */
  ${props => !props.isSticky && `
    transition-property: color;
    transition-delay: 1s;
  `}

  /* prevent items shifting on hover/focus */
  &::after {
    content: attr(title);
    display: block;
    font-weight: 500;
    height: 0;
    overflow: hidden;
    visibility: hidden;
  }

  &:hover,
  &:focus {
    font-weight: 500;
    border-bottom-color: currentColor;
  }

  ${props => props.active && `
    color: ${props.text === LIGHT
      ? '#fff'
      : props.theme.colors.black
    };

    font-weight: 500;
    border-bottom-color: currentColor;
  `}
`;

NavLink.propTypes = {
  isSticky: PropTypes.bool
};

const LargeNavList = props => (
  <NavList>
    <NavListItem>
      <NavLink
        href="/work"
        active
        isSticky={props.isSticky}
        text={props.text}
      >Work</NavLink>
    </NavListItem>
    <NavListItem>
      <NavLink
        href="/process"
        isSticky={props.isSticky}
        text={props.text}
      >Process</NavLink>
    </NavListItem>
    <NavListItem>
      <NavLink
        href="/about"
        isSticky={props.isSticky}
        text={props.text}
      >About</NavLink>
    </NavListItem>
  </NavList>
);

LargeNavList.propTypes = {
  text: PropTypes.oneOf([
    LIGHT,
    DARK,
  ]),
};

LargeNavList.defaultProps = {
  text: LIGHT,
};

export default LargeNavList;