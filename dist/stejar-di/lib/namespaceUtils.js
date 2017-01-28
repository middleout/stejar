"use strict";
/**
 * @param namespace
 * @returns {function(Function): Function}
 */
function namespace(namespace) {
    return function namespacedClass(entity) {
        entity.namespace = namespace;
        return entity;
    };
}
exports.namespace = namespace;
/**
 * @param object
 * @returns {string}
 */
function getNamespacedName(object) {
    var name = typeof object === "function" ? object.name : object.constructor.name;
    if (object.namespace) {
        name = object.namespace + '/' + name;
    }
    if (object.constructor.namespace) {
        name = object.constructor.namespace + '/' + name;
    }
    return name;
}
exports.getNamespacedName = getNamespacedName;
