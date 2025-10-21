// import cx from 'classnames';

// import PlatformInfoDialogButton from 'components/Layout/PlatformInfoDialogButton';

interface Props {
    className?: string;
}

function Footer({ className }: Props) {
    return (
        <footer className="pb-8">
            {/* <div className="">
                <span>© 2018-{new Date().getFullYear()} &nbsp;CZERTAINLY s.r.o. </span>
                <span className="">·</span>
                <a href="https://docs.czertainly.com/docs" target="_blank" rel="noopener noreferrer">
                    Documentation
                </a>
                <span className="">·</span>
                <a href="https://czertainly.atlassian.net/servicedesk/customer/portal/1" target="_blank" rel="noopener noreferrer">
                    Support
                </a>
                <span className="">·</span>
                <a href="https://www.czertainly.com" target="_blank" rel="noopener noreferrer">
                    About Us
                </a>
                <span className="">·</span>
                <PlatformInfoDialogButton />
            </div> */}
        </footer>
    );
}

export default Footer;
