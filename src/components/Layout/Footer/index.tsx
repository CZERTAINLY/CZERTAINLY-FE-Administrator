// import cx from 'classnames';

import PlatformInfoDialogButton from 'components/Layout/PlatformInfoDialogButton';

interface Props {
    className?: string;
}

function Footer({ className }: Props) {
    return (
        <footer className="py-4">
            <div className="text-sm font-semibold">
                <span>© 2018-{new Date().getFullYear()} &nbsp;CZERTAINLY s.r.o. </span>
                <span className="mx-2">·</span>
                <a href="https://docs.czertainly.com/docs" target="_blank" rel="noopener noreferrer" className="text-blue-600">
                    Documentation
                </a>
                <span className="mx-2">·</span>
                <a
                    href="https://czertainly.atlassian.net/servicedesk/customer/portal/1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600"
                >
                    Support
                </a>
                <span className="mx-2">·</span>
                <a href="https://www.czertainly.com" target="_blank" rel="noopener noreferrer" className="text-blue-600">
                    About Us
                </a>
                <span className="mx-2">·</span>
                <PlatformInfoDialogButton />
            </div>
        </footer>
    );
}

export default Footer;
