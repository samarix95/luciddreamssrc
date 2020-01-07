export function compare(obj1, obj2) {
    if (!Object.keys(obj2).every(key => obj1.hasOwnProperty(key))) {
        return false;
    }
    return Object.keys(obj1).every(function (key) {
        if (typeof obj1[key] == "object") {
            return compare(obj1[key], obj2[key]);
        }
        else {
            return obj1[key] === obj2[key];
        }
    });
}