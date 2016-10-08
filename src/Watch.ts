import { XPath } from "./xPath";
import { precompileString } from "./Utils";
import { Compile as angularCompile } from "wires-angular-expressions";
import { AsyncWatch, AsyncSubscribe } from "async-watch";

export interface IContext {
    locals?: any;
    scope?: any;
}
export interface ISubscription {
    unsubscribe();
    destroy();
}

export class Watch {

    /**
     * Evaluate a string with a given context
     *
     * @static
     * @param {Context} context
     * @param {(string | any[])} tpl
     * @returns
     *
     * @memberOf Watch
     */
    public static evaluate(context: IContext, tpl: string | any[]) {
        if (typeof tpl === "string") {
            tpl = precompileString(tpl);
        }
        let str = [];
        for (let i = 0; i < tpl.length; i++) {
            let item = tpl[i];
            if (typeof item === "object") {
                let expression = item[0];
                let model = angularCompile(expression);
                str.push(model(context.scope, context.locals));
            } else {
                str.push(item);
            }
        }
        return str.join("");
    }

    /**
     *
     *
     * @static
     * @param {Context} context
     * @param {(string | any[])} tpl
     * @param {{ (str: string) }} fn
     *
     * @memberOf Watch
     */
    public static template(context: IContext, tpl: string | any[], fn: { (str: string) }): ISubscription {
        if (typeof tpl === "string") {
            tpl = precompileString(tpl);
        }
        // After precompiling the string
        // Hello {{user.name}}, we love you {{user.name}}
        // will look like:
        // [ 'Hello ', [ 'user.name', [ 'user.name' ] ], ', we love you ', [ 'user.name', [ 'user.name' ] ] ]

        let precompiled: any[] = tpl;
        let watchables = [];

        // First things: collect watchable variables
        for (let i = 0; i < precompiled.length; i++) {
            let item = precompiled[i];
            if (typeof item === "object") {
                let watchable = item[1];
                for (let w = 0; w < watchable.length; w++) {
                    let variable = watchable[w];
                    // Gotta make sure we don't push twice the same variable
                    if (watchables.indexOf(variable) === -1) {
                        watchables.push(variable);
                    }
                }
            }
        }

        // evaluate instantly
        fn(this.evaluate(context, tpl));

        // No watchers, we can quite
        // Just make sure we have "fake" unsubscribe interfaces for compatibility
        if (watchables.length === 0) {
            return <ISubscription>{
                unsubscribe: () => null,
                destroy: () => null,
            };
        }

        let initial = true;

        // Create watchers
        let watchers = [];
        for (let i = 0; i < watchables.length; i++) {
            let vpath = watchables[i];
            // Locals have higher priority than the scope
            // So we will watch them first
            if (context.locals && XPath.hasProperty(context.locals, vpath)) {
                watchers.push(AsyncWatch(context.locals, vpath, () => null));
            } else {
                watchers.push(AsyncWatch(context.scope, vpath, (value) => null));
            }
        }
        return <ISubscription>AsyncSubscribe(watchers, (ch) => {
            if (initial === false) {
                fn(this.evaluate(context, tpl));
            }
            initial = false;
        });
    }
}