import cx from 'classnames';

import style from './Footer.module.scss';

interface Props {
    className?: string;
}

function Footer({ className }: Props) {
    return (
        <footer className={cx(style.root, className)}>
            <div className={style.container}>
                <span>© 2018-{new Date().getFullYear()} &nbsp;CZERTAINLY s.r.o. </span>
                <span className={style.spacer}>·</span>
                <a href="https://docs.czertainly.com/docs" target="_blank" rel="noopener noreferrer">
                    Documentation
                </a>
                <span className={style.spacer}>·</span>
                <a href="https://czertainly.atlassian.net/servicedesk/customer/portal/1" target="_blank" rel="noopener noreferrer">
                    Support
                </a>
                <span className={style.spacer}>·</span>
                <a href="https://www.czertainly.com" target="_blank" rel="noopener noreferrer">
                    About Us
                </a>
            </div>
        </footer>
    );
}

export default Footer;
