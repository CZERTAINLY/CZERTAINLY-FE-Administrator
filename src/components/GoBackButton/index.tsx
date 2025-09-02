import React from 'react';
import { Button } from 'reactstrap';
import { useLocation, useNavigate } from 'react-router';
import styles from './GoBackButton.module.scss';

interface GoBackButtonProps {
    className?: string;
    color?: string;
    size?: string;
    disabled?: boolean;
    children?: React.ReactNode;
    onClick?: () => void;
    fallbackPath?: string;
    style?: React.CSSProperties;
    arbitryPath?: string;
}

function GoBackButton({
    className = 'btn btn-secondary',
    color = 'secondary',
    size,
    disabled = false,
    children = 'Go Back',
    onClick,
    fallbackPath,
    arbitryPath,
    style,
}: GoBackButtonProps) {
    const navigate = useNavigate();
    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            if (arbitryPath) {
                navigate(arbitryPath);
            } else if (window.history.length > 1) {
                navigate(-1);
            } else if (fallbackPath) {
                // Fallback to specified path if no history
                navigate(fallbackPath);
            } else {
                // Default fallback to dashboard
                navigate('/');
            }
        }
    };

    return (
        <Button
            style={style}
            className={`${className} ${styles.goBackButton}`}
            color={color}
            size={size}
            disabled={disabled}
            onClick={handleClick}
        >
            <i className={`fa fa-arrow-left me-2 ${styles.icon}`} aria-hidden="true" />
            {children}
        </Button>
    );
}

export default GoBackButton;
