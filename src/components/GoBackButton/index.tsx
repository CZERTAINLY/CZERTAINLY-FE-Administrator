import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';

interface GoBackButtonProps {
    className?: string;
    disabled?: boolean;
    text?: string;
    onClick?: () => void;
    fallbackPath?: string;
    style?: React.CSSProperties;
    forcedPath?: string;
}

function GoBackButton({ className = '', disabled = false, text = 'Go Back', onClick, fallbackPath, forcedPath, style }: GoBackButtonProps) {
    const navigate = useNavigate();
    const handleClick = () => {
        if (onClick) {
            onClick();
        } else if (forcedPath) {
            navigate(forcedPath);
        } else if (window.history.length > 1) {
            navigate(-1);
        } else if (fallbackPath) {
            navigate(fallbackPath);
        } else {
            navigate('/');
        }
    };

    return (
        <button data-testid="go-back-button" style={style} className={`${className}`} disabled={disabled} onClick={handleClick}>
            <ArrowLeft size={16} aria-hidden="true" />
            {text}
        </button>
    );
}

export default GoBackButton;
