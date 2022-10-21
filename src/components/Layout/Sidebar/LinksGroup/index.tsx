import cx from "classnames";
import React, { useCallback, useState } from "react";
import { Route, RouteChildrenProps } from "react-router";
import { NavLink } from "react-router-dom";
import { Collapse } from "reactstrap";

import style from "./LinksGroup.module.scss";

interface ChildrenLink {
   _key: string;
   name: string;
   link: string;
}

interface Props {
   _key: string;
   header: React.ReactNode;
   headerLink?: string;
   childrenLinks?: ChildrenLink[];
   glyph?: string;
   className?: string;
}

function LinksGroup(props: Props) {

   const [isOpen, setIsOpen] = useState(window.location.href.includes("/app/acme"));

   const toggle = useCallback(() => setIsOpen(!isOpen), [isOpen]);

   const createHeaderLink = () => {

      return (

         <li key={props._key} className={cx(style.headerLink, props.className)}>

            <NavLink to={props.headerLink || ""} activeClassName={style.headerLinkActive}>
               <div>
                  <i className={props.glyph} />{" "}
                  <span className={style.menuLabel}>{props.header}</span>
               </div>
            </NavLink>
         </li>

      )

   }


   const createChildLinks = (match: RouteChildrenProps<{ [x: string]: string | undefined; }, unknown>) => {

      const matchClassName = cx({ [style.headerLinkActive]: !!match && match.match!.url.indexOf(props.headerLink!) > 0 });
      const arrowClassName = cx("fa fa-angle-down arrow", style.arrow, { [style.arrowActive]: isOpen });

      return (

         <li key={props._key} className={cx(style.headerLink, props.className)}>

            <a href="#/" className={matchClassName} onClick={(e) => { e.preventDefault(); toggle() }}>

               <div>
                  <i className={props.glyph} />{" "}
                  <span className={style.menuLabel}>{props.header}</span>
               </div>

               <div className={arrowClassName} />

            </a>

            <Collapse className={style.panel} isOpen={isOpen}>

               <ul>

                  {props.childrenLinks!.map(

                     (child) => (

                        <li key={child.link} className={cx(style.headerLink, props.className)}>

                           <NavLink to={child.link} activeClassName={style.headerLinkActive}>
                              <div>
                                 <i className={props.glyph} />{" "}
                                 <span className={style.menuLabel}>{child.name}</span>
                              </div>
                           </NavLink>

                        </li>

                     )

                  )}

               </ul>

            </Collapse>

         </li>
      )

   }


   if (!props.childrenLinks) return createHeaderLink();

   return (
      <Route path={props.headerLink} children={(match) => createChildLinks(match)} />
   );

}

export default LinksGroup;
