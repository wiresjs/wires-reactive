import { IContext } from "./IContext";
export interface ISubscription {
    unsubscribe(): any;
    destroy(): any;
}
export declare class Watch {
    static evalTemplate(context: IContext, tpl: string | any[]): string;
    static expression(context: IContext, expression: string | any[], fn: {
        (result: any);
    }): ISubscription;
    static template(context: IContext, tpl: string | any[], fn: {
        (str: string);
    }): ISubscription;
}
