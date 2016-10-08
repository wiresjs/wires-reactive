

/**
 *
 *
 * @export
 * @class XPath
 */
export class XPath {
    /**
     *
     *
     * @static
     * @param {any} path
     * @returns
     *
     * @memberOf XPath
     */
    public static dotNotation(path: string | string[]): any {
        if (path instanceof Array) {
            return {
                path: path,
                str: path.join("."),
            };
        }
        if (typeof path !== "string") {
            return;
        }
        return {
            path: path.split("\."),
            str: path,
        };
    }
    /**
     *
     *
     * @static
     * @param {any} obj
     * @param {any} path
     * @returns
     *
     * @memberOf XPath
     */
    public static hasProperty(obj: any, path: string) {
        if (path && path.length === 0 || obj === undefined) {
            return false;
        }
        let notation = this.dotNotation(path);
        if (!notation) {
            return false;
        }
        path = notation.path;
        let validNext = true;
        for (let i = 0; i < path.length; i++) {
            if (validNext && obj.hasOwnProperty(path[i])) {
                obj = obj[path[i]];
                if (obj === undefined) {
                    validNext = false;
                }
            } else {
                return false;
            }
        }
        return true;
    }
    /**
     *
     *
     * @static
     * @param {any} obj
     * @param {any} path
     * @returns
     *
     * @memberOf XPath
     */
    public static get(obj, path: string) {

        if (path.length === 0 || obj === undefined) {
            return undefined;
        }
        let notation = this.dotNotation(path);
        if (!notation) {
            return;
        }
        path = notation.path;
        for (let i = 0; i < path.length; i++) {
            obj = obj[path[i]];
            if (obj === undefined) {
                return undefined;
            }
        }
        return obj;
    }
}