import cx from 'classnames';
import React from 'react';
import { Button, ButtonProps } from 'reactstrap';

export type IconName =
    | 'plus'
    | 'copy'
    | 'trash'
    | 'times'
    | 'check'
    | 'plug'
    | 'pencil'
    | 'history'
    | 'cross-circle'
    | 'upload'
    | 'download'
    | 'group'
    | 'user'
    | 'cubes'
    | 'retweet'
    | 'minus-square'
    | 'info'
    | 'gavel'
    | 'push'
    | 'sync'
    | 'minus'
    | 'lock'
    | 'refresh'
    | 'reload'
    | 'handshake'
    | 'compromise'
    | 'destroy'
    | 'bomb'
    | 'search'
    | 'random'
    | 'sign'
    | 'verify'
    | 'key'
    | 'link'
    | 'recycle'
    | 'rekey';

export interface WidgetButtonProps {
    icon: IconName;
    id?: string;
    tooltip?: any;
    hidden?: boolean;
    disabled: boolean;
    custom?: React.ReactNode;
    onClick: (event: React.MouseEvent) => void;
}

interface Props {
    buttons: WidgetButtonProps[];
    justify?: 'start' | 'end' | 'center';
}

const colors = {
    plus: 'auto',
    copy: 'auto',
    trash: 'red',
    times: 'red',
    check: 'green',
    plug: 'auto',
    pencil: 'auto',
    history: 'auto',
    'cross-circle': 'black',
    upload: 'auto',
    download: 'auto',
    group: 'auto',
    user: 'auto',
    cubes: 'auto',
    retweet: 'auto',
    'minus-square': 'red',
    push: 'auto',
    sync: 'auto',
    info: 'auto',
    minus: 'red',
    gavel: 'auto',
    lock: 'auto',
    refresh: 'auto',
    reload: 'auto',
    handshake: 'red',
    compromise: 'red',
    destroy: 'red',
    bomb: 'red',
    search: 'auto',
    random: 'auto',
    sign: 'auto',
    verify: 'green',
    key: 'auto',
    link: 'auto',
    recycle: 'auto',
    rekey: 'auto',
};

const classNames = {
    plus: 'fa fa-plus',
    copy: 'fa fa-copy',
    trash: 'fa fa-trash',
    times: 'fa fa-times',
    check: 'fa fa-check',
    plug: 'fa fa-plug',
    pencil: 'fa fa-pencil-square-o',
    history: 'fa fa-history',
    'cross-circle': 'fa fa-times-circle',
    upload: 'fa fa-upload',
    download: 'fa fa-download',
    group: 'fa fa-group',
    user: 'fa fa-user-o',
    cubes: 'fa fa-cubes',
    retweet: 'fa fa-retweet',
    'minus-square': 'fa fa-minus-square',
    push: 'fa fa-arrow-circle-up',
    sync: 'fa fa-refresh',
    info: 'fa fa-info-circle',
    minus: 'fa fa-minus',
    gavel: 'fa fa-gavel',
    lock: 'fa fa-lock',
    refresh: 'fa fa-refresh',
    reload: 'fa fa-rotate-right',
    handshake: 'fa fa-circle-exclamation',
    compromise: 'fa fa-ban',
    destroy: 'fa fa-circle-minus',
    bomb: 'fa fa-bomb',
    search: 'fa fa-search',
    random: 'fa fa-dice',
    sign: 'fas fa-pen',
    verify: 'fa fa-check-square',
    key: 'fa fa-key',
    link: 'fa fa-link',
    recycle: 'fa fa-recycle',
    rekey: 'fa fa-random',
};

//TODO: Add refresh button put it on left which should be optional

function WidgetButtons({ buttons, justify = 'center' }: Props) {
    const renderButton = (button: WidgetButtonProps) => {
        let toolTip: JSX.Element | undefined;
        let style;

        let btnProps: ButtonProps = {
            className: 'btn btn-link',
            color: 'white',
            onClick: button.onClick,
            disabled: button.disabled,
        };

        if (!button.disabled) {
            style = { color: colors[button.icon] };
        }

        const key = button.icon + button.tooltip + button.id || '';

        return button.custom ? (
            <span key={key}>{button.custom}</span>
        ) : (
            <Button key={key} {...btnProps} title={button.tooltip} hidden={button.hidden}>
                <i className={classNames[button.icon]} style={style} />
                {toolTip}
            </Button>
        );
    };

    const renderedButtons: JSX.Element[] = [];

    buttons.forEach((button) => {
        renderedButtons.push(renderButton(button));
    });

    return (
        <div
            className={cx('d-flex ms-2', {
                'justify-content-start': justify === 'start',
                'justify-content-center': justify === 'center',
                'justify-content-end': justify === 'end',
            })}
        >
            {renderedButtons}
        </div>
    );
}

export default WidgetButtons;
