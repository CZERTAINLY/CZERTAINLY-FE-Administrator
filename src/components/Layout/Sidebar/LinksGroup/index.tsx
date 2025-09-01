import cx from 'classnames';
import React, { useCallback, useState } from 'react';
import { NavLink } from 'react-router';
import { Collapse } from 'reactstrap';

import style from './LinksGroup.module.scss';

interface ChildrenLink {
    name: string;
    link: string;
}

interface Props {
    header: React.ReactNode;
    headerLink?: string;
    childrenLinks?: ChildrenLink[];
    glyph?: string;
    className?: string;
}

function LinksGroup(props: Props) {
    const [isOpen, setIsOpen] = useState(window.location.href.includes('/app/acme'));

    const toggle = useCallback(() => setIsOpen(!isOpen), [isOpen]);

    const createHeaderLink = () => {
        return (
            <li className={cx(style.headerLink, props.className)}>
                <NavLink to={props.headerLink || ''} className={({ isActive }) => (isActive ? style.headerLinkActive : undefined)}>
                    <div>
                        <i className={props.glyph} />{' '}
                        <span className={style.menuLabel} data-testid={typeof props.header === 'string' ? props.header : undefined}>
                            {props.header}
                        </span>
                    </div>
                </NavLink>
            </li>
        );
    };

    const createChildLinks = () => {
        const matchClassName = cx(style.headerLink);
        const arrowClassName = cx('fa fa-angle-down arrow', style.arrow, { [style.arrowActive]: isOpen });

        return (
            <li className={cx(style.headerLink, props.className)}>
                <a
                    href="#/"
                    className={matchClassName}
                    onClick={(e) => {
                        e.preventDefault();
                        toggle();
                    }}
                >
                    <div>
                        <i className={props.glyph} />{' '}
                        <span className={style.menuLabel} data-testid={typeof props.header === 'string' ? props.header : undefined}>
                            {props.header}
                        </span>
                    </div>

                    <div className={arrowClassName} />
                </a>

                <Collapse className={style.panel} isOpen={isOpen}>
                    <ul>
                        {props.childrenLinks!.map((child) => (
                            <li key={child.link} className={cx(style.headerLink, props.className)}>
                                <NavLink to={child.link} className={({ isActive }) => (isActive ? style.headerLinkActive : undefined)}>
                                    <div>
                                        <i className={props.glyph} />{' '}
                                        <span className={style.menuLabel} data-testid={child.name}>
                                            {child.name}
                                        </span>
                                    </div>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </Collapse>
            </li>
        );
    };

    if (!props.childrenLinks) return createHeaderLink();

    return createChildLinks();

    /**
   return (
      <Route path={props.headerLink} children={(match) => createChildLinks(match)} />
   );
    */
}

export default LinksGroup;
