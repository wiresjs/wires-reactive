import { dig } from "extract-vars";
export const precompileString = (str) => {
    let re = /({{\s*[^}]+\s*}})/g;
    let list = str.split(re).map((x) => {
        let expr = x.match(/{{\s*([^}]+)\s*}}/);
        if (expr) {
            let expressionString = expr[1].trim();
            return [expressionString, dig(expressionString)];
        }
        return x;
    });
    let filtered = [];
    for (let i = 0; i < list.length; i++) {
        if (list[i] !== undefined && list[i] !== "") {
            filtered.push(list[i]);
        }
    }
    return filtered;
};
export const precompileExpression = (str) => {
    return [str, dig(str)];
};
export const extractWatchables = (str) => {
    return dig(str);
};
