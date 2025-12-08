export function validateText(str: string, length?: any, maxLength?: any): boolean {
    str = str ? str.toString() : "";
    if (str) {
        if (
            !str.trim() ||
            str.trim() === "" ||
            (length && str.length < length) ||
            (maxLength && str.length > maxLength)
        ) {
            return false;
        }
        return true;
    }
    return false;
}
