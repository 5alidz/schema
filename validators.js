"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateArray = exports.validateObject = exports.validateBoolean = exports.validateNumber = exports.validateString = exports.reducer = void 0;
var utils_1 = require("./utils");
function reducer(key, validator, value) {
    if (validator.type == 'string') {
        return validateString(key, validator, value);
    }
    else if (validator.type == 'number') {
        return validateNumber(key, validator, value);
    }
    else if (validator.type == 'array') {
        return validateArray(key, validator, value);
    }
    else if (validator.type == 'boolean') {
        return validateBoolean(key, validator, value);
    }
    else if (validator.type == 'object') {
        return validateObject(key, validator, value);
    }
    else {
        // @ts-expect-error
        throw new Error(validator.type + " is not recognized as validation type");
    }
}
exports.reducer = reducer;
function validateString(validationKey, validation, dataValue) {
    var error = {
        key: validationKey,
        message: '',
    };
    if (dataValue == null && validation.optional) {
        return null;
    }
    else if (dataValue == null) {
        return __assign(__assign({}, error), { message: "expected string but received " + typeof dataValue });
    }
    else if (dataValue == '') {
        return __assign(__assign({}, error), { message: "expected string of length > 0" });
    }
    else if (typeof dataValue != 'string') {
        return __assign(__assign({}, error), { message: "expected \"string\" but received " + typeof dataValue + " instead" });
    }
    else {
        if (validation.pattern && validation.pattern.test(dataValue) == false) {
            return __assign(__assign({}, error), { message: "expected string to match pattern: " + validation.pattern });
        }
        if (validation.minLength && typeof validation.minLength == 'number' && dataValue.length < validation.minLength) {
            return __assign(__assign({}, error), { message: "expected string of length > \"" + validation.minLength + "\"" });
        }
        if (validation.maxLength && typeof validation.maxLength == 'number' && dataValue.length > validation.maxLength) {
            return __assign(__assign({}, error), { message: "expected string of length < \"" + validation.maxLength + "\"" });
        }
        return null;
    }
}
exports.validateString = validateString;
function validateNumber(validationKey, validation, dataValue) {
    var error = {
        key: validationKey,
        message: '',
    };
    if (dataValue == null && validation.optional) {
        return null;
    }
    else if (dataValue == null || typeof dataValue != 'number') {
        return __assign(__assign({}, error), { message: "expected number but received " + typeof dataValue });
    }
    else {
        if (validation.min && typeof validation.min == 'number' && dataValue < validation.min) {
            return __assign(__assign({}, error), { message: "expected number to be > " + validation.min });
        }
        else if (validation.max && typeof validation.max == 'number' && dataValue > validation.max) {
            return __assign(__assign({}, error), { message: "expected number to be < " + validation.max });
        }
        return null;
    }
}
exports.validateNumber = validateNumber;
function validateBoolean(validationKey, validation, dataValue) {
    var error = {
        key: validationKey,
        message: '',
    };
    if (dataValue == null && validation.optional) {
        return null;
    }
    else if (dataValue == null || typeof dataValue != 'boolean') {
        return __assign(__assign({}, error), { message: "expected boolean but received " + typeof dataValue });
    }
    else {
        return null;
    }
}
exports.validateBoolean = validateBoolean;
function validateObject(validationKey, validation, dataValue) {
    var error = {
        key: validationKey,
        message: '',
    };
    if (dataValue == null && validation.optional) {
        return null;
    }
    else if (dataValue == null || !utils_1.isPlainObject(dataValue)) {
        return __assign(__assign({}, error), { message: "expected object but received " + typeof dataValue });
    }
    else {
        if (!validation.shape) {
            return __assign(__assign({}, error), { message: "missing object shape validator" });
        }
        var shapeKeys = Object.keys(validation.shape);
        var errors = [];
        for (var i = 0; i < shapeKeys.length; i++) {
            var shapeKey = shapeKeys[i];
            var shapeValidator = validation.shape[shapeKey];
            var res = reducer(shapeKey, shapeValidator, dataValue[shapeKey]);
            if (res)
                errors.push(shapeKey + ": " + res.message);
        }
        if (errors.length > 0) {
            return __assign(__assign({}, error), { message: errors.join('\n') });
        }
        else {
            return null;
        }
    }
}
exports.validateObject = validateObject;
function validateArray(validationKey, validation, dataValue) {
    var error = {
        key: validationKey,
        message: '',
    };
    if (dataValue == null && validation.optional) {
        return null;
    }
    else if (dataValue == null || !Array.isArray(dataValue)) {
        return __assign(__assign({}, error), { message: "expected array but received " + typeof dataValue });
    }
    else {
        if (!validation.of) {
            return __assign(__assign({}, error), { message: "missing array type" });
        }
        var errors = [];
        for (var i = 0; i < dataValue.length; i++) {
            var res = reducer("[" + i + "]", validation.of, dataValue[i]);
            if (res)
                errors.push("[" + i + "]: " + res.message);
        }
        return errors.length > 0 ? __assign(__assign({}, error), { message: errors.join('\n') }) : null;
    }
}
exports.validateArray = validateArray;
