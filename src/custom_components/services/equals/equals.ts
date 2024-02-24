export function isEqual(a: any, b: any): boolean {
    if (typeof a !== typeof b) {
        return false;
    }
    if (typeof a !== 'object') {
        return a === b;
    }
    if (Array.isArray(a)) {
        if (a.length !== b.length) {
            return false;
        }
        for (let i = 0; i < a.length; i++) {
            if (!isEqual(a[i], b[i])) {
                return false;
            }
        }
        return true;
    }
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) {
        return false;
    }
    for (const key of keysA) {
        if (!isEqual(a[key], b[key])) {
            return false;
        }
    }
    return true;
}