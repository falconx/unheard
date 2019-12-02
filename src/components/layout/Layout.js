import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme, keyframes } from 'styled-components';
import Image from 'gatsby-image/withIEPolyfill';

import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

import { Media } from '../Media';
import VerticalSpacing from '../VerticalSpacing';

import LargeNavLinks from './nav/LargeNavLinks';
import CompactNavLinks from './nav/CompactNavLinks';

import logoLight from '../../images/logo-light.png';
import logoDark from '../../images/logo-dark.png';

const SLIDE_IN_DURATION = 1000; // ms
const FADE_IN_DURATION = 500; // ms

const slideIn = keyframes`
  0% {
    position: absolute;
    transform: translateY(0);
  }

  1% {
    position: fixed;
    background-color: #fff;
    transform: translateY(-100%);
  }

  100% {
    position: fixed;
    background-color: #fff;
    transform: translateY(0);
  }
`;

const Header = styled.header`
  position: relative;
  min-height: ${props => props.theme.layout.navHeight.xs}px;

  ${props => props.theme.query.md} {
    min-height: ${props => props.theme.layout.navHeight.md}px;
  }
`;

const Constrain = styled.div`
  position: relative;
  padding: 0 10px;
  margin: 0 auto;
  max-width: ${props => props.theme.layout.constrain}px;

  ${props => props.theme.query.md} {
    padding: 0 30px;
  }
`;

const StyledNav = styled.nav`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
  color: ${props => (!props.isSticky || props.isDrawerOpen) ? '#fff' : props.theme.colors.black};

  animation: ${slideIn} ${SLIDE_IN_DURATION / 1000}s;
  animation-iteration-count: 1;
  animation-fill-mode: backwards;
  animation-direction: reverse;

  ${props => props.isSticky && `
    animation-fill-mode: forwards;
    animation-direction: normal;
  `}

  ${props => props.isInitialRender && `
    visibility: hidden;
  `}
`;

StyledNav.propTypes = {
  isInitialRender: PropTypes.bool,
  isSticky: PropTypes.bool,
};

const NavContent = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: ${props => props.theme.layout.constrain}px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${props => props.theme.layout.navHeight.xs}px;
  padding: 0 10px;
  font-size: 1.5rem;
  letter-spacing: -0.8px;

  ${props => props.theme.query.md} {
    height: ${props => props.theme.layout.navHeight.md}px;
    padding: 0 30px;
  }
`;

const Nav = ({ stickyOffset, onSetIsSticky, isDrawerOpen, ...props }) => {
  const [isSticky, setIsSticky] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);

  const onScroll = () => {
    setIsSticky(window.pageYOffset > stickyOffset);

    if (isSticky !== (window.pageYOffset > stickyOffset)) {
      onSetIsSticky(window.pageYOffset > stickyOffset);
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', onScroll);

    // hides the nav whilst it transitions into position
    setTimeout(() => {
      setIsInitialRender(false);
    }, SLIDE_IN_DURATION);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  });

  return (
    <StyledNav
      {...props}
      isInitialRender={isInitialRender}
      isSticky={isSticky}
      isDrawerOpen={isDrawerOpen}
      // force re-render to initiate CSS animation
      key={isSticky}
    />
  );
};

Nav.propTypes = {
  stickyOffset: PropTypes.number,
  onSetIsSticky: PropTypes.func,
};

Nav.defaultProps = {
  stickyOffset: 0,
  onSetIsSticky: Function.prototype,
};

const Logo = styled.img.attrs({
  src: logoLight,
  alt: '',
})`
  height: 20px;
`;

const NavToggle = styled.button.attrs({
  type: 'button'
})`
  width: 20px;
  height: 20px;
  position: relative;
  z-index: 10;

  &:before,
  &:after {
    content: '';
    position: absolute;
    background-color: currentColor;
    transition: transform 0.25s ease-out;
  }

  /* vertical line */
  &:before {
    top: 0;
    left: 50%;
    width: 2px;
    height: 100%;
    margin-left: -1px;
  }

  /* horizontal line */
  &:after {
    top: 50%;
    left: 0;
    width: 100%;
    height: 2px;
    margin-top: -1px;
  }

  ${props => props.isOpen && `
    &:before,
    &:before,
    &:after,
    &:after {
      transform: rotate(135deg);
    }
  `}
`;

const Drawer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  color: #fff;
  background-color: ${props => props.theme.colors.darkGrey};
  opacity: ${props => props.show ? '1' : '0'};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transition: ${FADE_IN_DURATION / 1000}s;
`;

const DrawerContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0 10px;

  ${props => props.theme.query.md} {
    padding: 0 30px;
  }
`;

const Copyright = styled.small`
  margin-bottom: 10px;
  margin-top: auto;
  font: inherit;

  &::before {
    content: '';
    display: inline-block;
    vertical-align: baseline;
    height: 1em;
    width: 1em;
    margin-right: 5px;
    background-color: currentColor;
  }

  ${props => props.theme.query.md} {
    min-height: 80px;
    display: flex;
    align-items: center;
    margin-bottom: 0;
  }
`;

const Video = styled.video`
  object-fit: cover;
  height: 100vh !important;
`;

const Layout = ({ hero, video, theme, children }) => {
  const headerEl = useRef(null);

  const [showDrawer, setShowDrawer] = useState(false);
  const [stickyOffset, setStickyOffset] = useState();
  const [isSticky, setIsSticky] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const player = new Plyr(document.getElementById('plyr'), {
    // title: 'Todo',
    controls: false,
    autoplay: true,
    clickToPlay: false,
    loop: {
      active: true,
    },
    fullscreen: {
      enabled: false,
      fallback: false,
    },
  });

  useLayoutEffect(() => {
    setStickyOffset(headerEl.current.offsetHeight);
  });

  useEffect(() => {
    document.body.classList[showDrawer ? 'add' : 'remove']('noscroll');
  }, [showDrawer]);

  useEffect(() => {
    setIsAnimating(true);

    setTimeout(() => {
      setIsAnimating(false);
    }, SLIDE_IN_DURATION);
  }, [isSticky]);

  return (
    <React.Fragment>
      {/* <Header siteTitle={data.site.siteMetadata.title} /> */}

      <Header ref={headerEl}>
        <Media>
          {mq => (
            <Nav
              stickyOffset={stickyOffset}
              onSetIsSticky={setIsSticky}
              isDrawerOpen={showDrawer}
            >
              <NavContent>
                <a href="/">
                  <Logo src={((!isSticky && isAnimating) || isSticky) ? logoDark : logoLight} />
                </a>

                {mq.lte('md') ? (
                  <React.Fragment>
                    <NavToggle
                      isOpen={showDrawer}
                      onClick={() => setShowDrawer(!showDrawer)}
                    />

                    <Drawer show={showDrawer}>
                      <NavContent>
                        <a href="/">
                          <Logo />
                        </a>
                      </NavContent>
                      <DrawerContent>
                        <CompactNavLinks />
                        <Copyright>
                          &copy; Unheard 2019 &mdash; Norwich &amp; London
                        </Copyright>
                      </DrawerContent>
                    </Drawer>
                  </React.Fragment>
                ) : (
                  <LargeNavLinks
                    isSticky={isSticky}
                  />
                )}
              </NavContent>
            </Nav>
          )}
        </Media>

        {hero && (
          <Image
            fluid={hero}
            objectFit="cover"
            objectPosition="top center"
            style={{
              height: '100vh',
              width: '100%',
            }}
          />
        )}

        {!hero && video && video.mp4 && (
          <Video
            src={video.mp4}
            id="plyr"
          />
        )}
      </Header>

      <VerticalSpacing size={3} />

      <main role="main">
        <Constrain>
          {children}
        </Constrain>
      </main>
    </React.Fragment>
  );
}

Layout.propTypes = {
  hero: PropTypes.object,
  video: PropTypes.shape({
    mp4: PropTypes.string,
    webm: PropTypes.string,
  }),
  theme: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

export default withTheme(Layout);
