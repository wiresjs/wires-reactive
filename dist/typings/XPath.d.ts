export declare class XPath {
    static dotNotation(path: string | string[]): any;
    static hasProperty(obj: any, path: string): boolean;
    static get(obj: any, path: string): any;
    static set(obj: any, xpath: string, v: string): void;
}
