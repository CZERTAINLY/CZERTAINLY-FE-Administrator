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
