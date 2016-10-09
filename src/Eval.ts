import { IContext } from "./IContext";
import { Compile as angularCompile } from "wires-angular-expressions";

/**
 *
 *
 * @export
 * @class Eval
 */
export class Eval {
    /**
     * Assignes a value to an expression
     *
     * @static
     * @param {IContext} context
     * @param {string} expression
     * @param {*} value
     *
     * @memberOf Eval
     */
    public static assign(context: IContext, expression: string, value: any) {
        let model = angularCompile(expression);
        model.assign(context.scope, value);
    }

    /**
     * Evaluates an expression
     *
     * @static
     * @param {IContext} context
     * @param {string} expression
     * @returns
     *
     * @memberOf Eval
     */
    public static expression(context: IContext, expression: string) {
        let model = angularCompile(expression);
        return model(context.scope, context.locals);
    }
}