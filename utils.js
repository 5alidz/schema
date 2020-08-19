"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPlainObject = void 0;
function isPlainObject(maybeObject) {
    return (typeof maybeObject == 'object' &&
        maybeObject != null &&
        maybeObject.constructor == Object &&
        Object.prototype.toString.call(maybeObject) == '[object Object]');
}
exports.isPlainObject = isPlainObject;
