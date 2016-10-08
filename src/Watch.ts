import { precompileString } from "./Utils";
import { Compile, Parser } from "wires-angular-expressions";
import {  AsyncWatch, AsyncSubscribe, AsyncWatchArray } from "async-watch";
export class Watch {
    public static template(tpl: string | any[]) {
        if (typeof tpl === "string") {
            tpl = precompileString(tpl);
        }
    }
}
