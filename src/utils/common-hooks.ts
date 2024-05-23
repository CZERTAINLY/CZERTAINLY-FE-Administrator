import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { actions as alertActions } from 'ducks/alerts';

interface WindowSizes {
    width: number;
    height: number;
}

export function useWindowSize(): WindowSizes {
    const [screenDimensions, setScreenDimensions] = useState<WindowSizes>({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        function handleResize() {
            setScreenDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return screenDimensions;
}

export enum DeviceType {
    Mobile = 'mobile',
    Tablet = 'tablet',
    Desktop = 'desktop',
}

export function useDeviceType(): DeviceType {
    const [deviceType, setDeviceType] = useState<DeviceType>(DeviceType.Desktop);

    useEffect(() => {
        function handleResize() {
            const { innerWidth } = window;
            if (innerWidth <= 768) {
                setDeviceType(DeviceType.Mobile);
            } else if (innerWidth <= 1024) {
                setDeviceType(DeviceType.Tablet);
            } else {
                setDeviceType(DeviceType.Desktop);
            }
        }

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return deviceType;
}

export const useCopyToClipboard = () => {
    const dispatch = useDispatch();

    const copyToClipboard = useCallback(
        (
            text: string,
            successMessage: string = 'Content was copied to clipboard',
            errorMessage: string = 'Failed to copy content to clipboard',
        ) => {
            navigator.clipboard
                .writeText(text)
                .then(() => dispatch(alertActions.success(successMessage)))
                .catch(() => dispatch(alertActions.error(errorMessage)));
        },
        [dispatch],
    );

    return copyToClipboard;
};
