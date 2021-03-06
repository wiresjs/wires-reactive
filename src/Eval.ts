import { XPath } from "./XPath";
import { IContext } from "./IContext";
import { Compile as angularCompile } from "wires-angular-expressions";
import { dig } from "extract-vars";

let exprCache = {};


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
     * // let model = angularCompile(expression);
     * // model.assign(context.scope, value);
     * @memberOf Eval
     */
    public static assign(context: IContext, expression: string, value: any) {
        let cached = exprCache[expression];
        let variables = []
        if (cached) {
            variables = cached;
        } else {
            variables = dig(expression);
            exprCache[expression] = variables;
        }
        let targetVariable = variables[0];
        if (targetVariable) {
            if (context.locals && XPath.get(context.locals, targetVariable) !== undefined) {
                XPath.set(context.locals, targetVariable, value);
            } else {
                XPath.set(context.scope, targetVariable, value);
            }
        }

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