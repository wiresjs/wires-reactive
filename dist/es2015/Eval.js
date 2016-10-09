import { Compile as angularCompile } from "wires-angular-expressions";
export class Eval {
    static assign(context, expression, value) {
        let model = angularCompile(expression);
        model.assign(context.scope, value);
    }
    static expression(context, expression) {
        let model = angularCompile(expression);
        return model(context.scope, context.locals);
    }
}
