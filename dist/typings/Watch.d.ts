export interface IContext {
    locals?: any;
    scope?: any;
}
export interface ISubscription {
    unsubscribe(): any;
    destroy(): any;
}
export declare class Watch {
    static evaluate(context: IContext, tpl: string | any[]): string;
    static template(context: IContext, tpl: string | any[], fn: {
        (str: string);
    }): ISubscription;
}
