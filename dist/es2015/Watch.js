import { Eval } from "./Eval";
import { XPath } from "./XPath";
import { precompileExpression, precompileString } from "./Utils";
import { Compile as angularCompile } from "wires-angular-expressions";
import { AsyncWatch, AsyncSubscribe } from "async-watch";
export class Watch {
    static evalTemplate(context, tpl) {
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
            }
            else {
                str.push(item);
            }
        }
        return str.join("");
    }
    static expression(context, expression, fn) {
        if (typeof expression === "string") {
            expression = precompileExpression(expression);
        }
        let watchables = expression[1];
        let template = expression[0];
        fn(Eval.expression(context, template));
        if (watchables.length === 0) {
            return;
        }
        let watchers = [];
        let initial = true;
        for (let i = 0; i < watchables.length; i++) {
            let vpath = watchables[i];
            if (context.locals && XPath.hasProperty(context.locals, vpath)) {
                watchers.push(AsyncWatch(context.locals, vpath, () => null));
            }
            else {
                watchers.push(AsyncWatch(context.scope, vpath, (value) => null));
            }
        }
        return AsyncSubscribe(watchers, (ch) => {
            if (initial === false) {
                fn(Eval.expression(context, template));
            }
            initial = false;
        });
    }
    static template(context, tpl, fn) {
        if (typeof tpl === "string") {
            tpl = precompileString(tpl);
        }
        let precompiled = tpl;
        let watchables = [];
        for (let i = 0; i < precompiled.length; i++) {
            let item = precompiled[i];
            if (typeof item === "object") {
                let watchable = item[1];
                for (let w = 0; w < watchable.length; w++) {
                    let variable = watchable[w];
                    if (watchables.indexOf(variable) === -1) {
                        watchables.push(variable);
                    }
                }
            }
        }
        fn(this.evalTemplate(context, tpl));
        if (watchables.length === 0) {
            return;
        }
        let initial = true;
        let watchers = [];
        for (let i = 0; i < watchables.length; i++) {
            let vpath = watchables[i];
            if (context.locals && XPath.hasProperty(context.locals, vpath)) {
                watchers.push(AsyncWatch(context.locals, vpath, () => null));
            }
            else {
                watchers.push(AsyncWatch(context.scope, vpath, (value) => null));
            }
        }
        return AsyncSubscribe(watchers, (ch) => {
            if (initial === false) {
                fn(this.evalTemplate(context, tpl));
            }
            initial = false;
        });
    }
}
