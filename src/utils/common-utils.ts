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

export const isObjectSame = (obj1: Record<string, unknown>, obj2: Record<string, unknown>): boolean => {
    if (obj1 === obj2) {
        return true;
    }

    if (typeof obj1 !== "object" || obj1 === null || typeof obj2 !== "object" || obj2 === null) {
        return false;
    }

    let keys1 = Object.keys(obj1);
    let keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let key of keys1) {
        if (!keys2.includes(key) || !isObjectSame(obj1[key] as Record<string, unknown>, obj2[key] as Record<string, unknown>)) {
            return false;
        }
    }

    return true;
};
