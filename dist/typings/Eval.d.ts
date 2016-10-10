import { IContext } from "./IContext";
export declare class Eval {
    static assign(context: IContext, expression: string, value: any): void;
    static expression(context: IContext, expression: string): any;
}
