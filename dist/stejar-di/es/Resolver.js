"use strict";
/**
 * @param serviceManager
 * @param classToInvoke
 * @returns {function(...[any]): any}
 * @constructor
 */
function Resolver(classToInvoke, methodToInvoke) {
    if (methodToInvoke === void 0) { methodToInvoke = "invoke"; }
    return function (serviceManager) {
        return function resolveViaClass() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return (_a = serviceManager.get(classToInvoke))[methodToInvoke].apply(_a, args);
            var _a;
        };
    };
}
exports.Resolver = Resolver;
