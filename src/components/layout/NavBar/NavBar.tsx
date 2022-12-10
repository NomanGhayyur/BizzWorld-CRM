import React, { useId, useMemo, useContext, useCallback } from 'react';
import layoutContext from '../../../layout/layout.context';
import { ColorSchemes, Input } from 'elements';

type navBarSize = 'large' | 'small' | 'medium' | 'x-large' | 'xx-large';

type propTypes = {
  className?: string;
  ref?: React.Ref<HTMLElement>;
  style?: React.CSSProperties;
  type?: ColorSchemes;
  size?: navBarSize;
  fixed?: 'top' | 'bottom';
  theme?: 'light' | 'dark';
};

const sizeMaps: { [key in navBarSize]: string } = {
  small: 'sm',
  medium: 'md',
  large: 'lg',
  'x-large': 'xl',
  'xx-large': 'xxl',
};

const NavBar = React.forwardRef<
  HTMLElement,
  React.PropsWithoutRef<React.PropsWithChildren<propTypes>>
>((props, ref) => {
  const navBarColor = useMemo(
    () => (props.type ? `bg-${props.type}` : ''),
    [props.type]
  );
  const navBarSize = useMemo(
    () => sizeMaps[props.size || 'large'],
    [props.size]
  );
  const navBarFix = useMemo(
    () => (props.fixed ? `fixed-${props.fixed}` : ''),
    [props.fixed]
  );
  const id = useId();
  const [state, dispatch] = useContext(layoutContext);

  const onNavClick = () => dispatch({ fullSideNav: !state.fullSideNav });
  const onSearchByText: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      setFilterText(e.target.value);
    }, []);

  return (
    <nav
      data-test="NavBarWrapper"
      ref={ref}
      className={`navbar navbar-expand-${navBarSize} ${navBarFix} navbar-${
        props.theme
      } ${navBarColor} ${props.className || ''}`.trim()}
      style={props.style}
    >
      <button
        onClick={onNavClick}
        className="navbar-toggler"
        type="button"
        aria-controls="navbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          fill="currentColor"
          className="bi bi-list"
          viewBox="0 0 16 16"
          color="black"
        >
          <path
            fillRule="evenodd"
            d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
          />
        </svg>
      </button>
      <div className="collapse navbar-collapse text-right" id={id}>
        {props.children}
      </div>
    </nav>
  );
});

NavBar.defaultProps = {
  className: '',
  type: 'primary',
  theme: 'light',
};

export default NavBar;
function setFilterText(value: string) {
  throw new Error('Function not implemented.');
}
