export const removeNullValues = (obj: any): any => {
    if (obj === null || obj === undefined) {
        return null;
    }

    if (Array.isArray(obj)) {
        return obj.map(removeNullValues).filter((val) => val !== null);
    }

    if (typeof obj === "object") {
        const newObj: any = {};
        for (const [key, value] of Object.entries(obj)) {
            const newValue = removeNullValues(value);
            if (newValue !== null) {
                newObj[key] = newValue;
            }
        }
        return newObj;
    }

    return obj;
};

export const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getStepValue = (type: string) => {
    if (type === "datetime" || type === "time" || type === "datetime-local") {
        return 1;
    } else return undefined;
};
