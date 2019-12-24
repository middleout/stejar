"use strict";

const bablyon = require("babylon");

const traverse = require("@babel/traverse");

function checkNode(node, components) {
    return components.indexOf(node.openingElement.name.name) !== -1;
}

function checkFn(expression, functions) {
    return functions.indexOf(expression.callee.name) !== -1;
}

function getNodeComment(node) {
    let comment = "";

    node.openingElement.attributes.forEach(el => {
        if (el.type === "JSXAttribute") {
            if (el.name.name === "__comment") {
                comment = el.value.value;
            }
        }
    });
    return comment;
}

function getNodeValue(node) {
    let children = node.children.map(function(item) {
        // If we have a weird <Translate>{"..."}</Translate> we need to use the "expression" value
        if (item.type === "JSXExpressionContainer") {
            return item.expression;
        }

        return item;
    });
    children = children.filter(function(item) {
        if (!item.value && (!item.extra || !item.extra.raw)) {
            return false;
        } // If we have more than 1 child but these children actually are spaces/new lines, filter them out

        let val;
        if (item.extra.raw) {
            val = item.extra.raw.replace(/(?:\r\n|\r|\n)/g, "").replace(/ /g, "");
        } else {
            val = item.value.replace(/(?:\r\n|\r|\n)/g, "").replace(/ /g, "");
        }

        return !!val;
    });

    if (children.length === 0) {
        return "";
    }

    if (children[0].extra && children[0].extra.raw) {
        return children[0].extra.raw.trim();
    }

    return children[0].value.trim();
}

function getFnFirstArg(node) {
    return node.arguments[0].value;
}
function getFnThirdArg(node) {
    return node.arguments.length > 2 ? node.arguments[2].value : "";
}

function extract(code) {
    const components = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ["Translate"];
    const functions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ["translate", "__"];
    const ast = bablyon.parse(code, {
        sourceType: "module",
        plugins: [
            "jsx",
            "objectRestSpread",
            "decorators-legacy",
            "classProperties",
            "exportDefaultFrom",
            "exportNamespaceFrom",
            "asyncGenerators",
            "dynamicImport",
            "typescript",
        ],
    });
    const result = [];
    traverse.default(ast, {
        enter: function enter(path) {
            switch (path.node.type) {
                case "JSXElement": {
                    if (!checkNode(path.node, components)) {
                        return;
                    }

                    const parts = getNodeValue(path.node).split("\n");
                    let nodeValue = "";
                    parts.forEach(part => {
                        nodeValue += part.trim() + " ";
                    });
                    nodeValue = nodeValue.trim();

                    result.push({
                        line: path.node.loc.start.line,
                        value: nodeValue,
                        comment: getNodeComment(path.node),
                    });
                    break;
                }

                case "CallExpression":
                    if (!checkFn(path.node, functions)) {
                        return;
                    }

                    result.push({
                        line: path.node.loc.start.line,
                        value: getFnFirstArg(path.node),
                        comment: getFnThirdArg(path.node),
                    });
                    break;
            }
        },
    });
    return result;
}

module.exports = {
    extract: extract,
};
