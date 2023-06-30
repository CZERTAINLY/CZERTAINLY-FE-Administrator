import { useEffect, useState } from "react";

interface ScreenDimensions {
    width: number;
    height: number;
}

export function useScreenDimensions(): ScreenDimensions {
    const [screenDimensions, setScreenDimensions] = useState<ScreenDimensions>({
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

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return screenDimensions;
}

export type DeviceType = "mobile" | "tablet" | "desktop";

export function useDeviceType(): DeviceType {
    const [deviceType, setDeviceType] = useState<DeviceType>("desktop");

    useEffect(() => {
        function handleResize() {
            const { innerWidth } = window;
            if (innerWidth <= 768) {
                setDeviceType("mobile");
            } else if (innerWidth <= 1024) {
                setDeviceType("tablet");
            } else {
                setDeviceType("desktop");
            }
        }

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return deviceType;
}
