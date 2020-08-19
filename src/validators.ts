import {
  ModelPropStringType,
  ModelPropArrayType,
  ModelPropObjectType,
  ModelPropBooleanType,
  ModelPropNumberType,
  ValidationPropError,
  ModelValidator,
} from './types';
import { isPlainObject } from './utils';

export function reducer(key: string, validator: ModelValidator, value: unknown) {
  if (validator.type == 'string') {
    return validateString(key, validator, value);
  } else if (validator.type == 'number') {
    return validateNumber(key, validator, value);
  } else if (validator.type == 'array') {
    return validateArray(key, validator, value);
  } else if (validator.type == 'boolean') {
    return validateBoolean(key, validator, value);
  } else if (validator.type == 'object') {
    return validateObject(key, validator, value);
  } else {
    // @ts-expect-error
    throw new Error(`${validator.type} is not recognized as validation type`);
  }
}

export function validateString(
  validationKey: string,
  validation: ModelPropStringType,
  dataValue: unknown
): ValidationPropError | null {
  const error = {
    key: validationKey,
    message: '',
  };
  if (dataValue == null && validation.optional) {
    return null;
  } else if (dataValue == null) {
    return { ...error, message: `expected string but received ${typeof dataValue}` };
  } else if (dataValue == '') {
    return { ...error, message: `expected string of length > 0` };
  } else if (typeof dataValue != 'string') {
    return { ...error, message: `expected "string" but received ${typeof dataValue} instead` };
  } else {
    if (validation.pattern && validation.pattern.test(dataValue) == false) {
      return { ...error, message: `expected string to match pattern: ${validation.pattern}` };
    }
    if (validation.minLength && typeof validation.minLength == 'number' && dataValue.length < validation.minLength) {
      return { ...error, message: `expected string of length > "${validation.minLength}"` };
    }
    if (validation.maxLength && typeof validation.maxLength == 'number' && dataValue.length > validation.maxLength) {
      return { ...error, message: `expected string of length < "${validation.maxLength}"` };
    }
    return null;
  }
}

export function validateNumber(
  validationKey: string,
  validation: ModelPropNumberType,
  dataValue: unknown
): ValidationPropError | null {
  const error = {
    key: validationKey,
    message: '',
  };
  if (dataValue == null && validation.optional) {
    return null;
  } else if (dataValue == null || typeof dataValue != 'number') {
    return { ...error, message: `expected number but received ${typeof dataValue}` };
  } else {
    if (validation.min && typeof validation.min == 'number' && dataValue < validation.min) {
      return { ...error, message: `expected number to be > ${validation.min}` };
    } else if (validation.max && typeof validation.max == 'number' && dataValue > validation.max) {
      return { ...error, message: `expected number to be < ${validation.max}` };
    }
    return null;
  }
}

export function validateBoolean(
  validationKey: string,
  validation: ModelPropBooleanType,
  dataValue: unknown
): ValidationPropError | null {
  const error = {
    key: validationKey,
    message: '',
  };
  if (dataValue == null && validation.optional) {
    return null;
  } else if (dataValue == null || typeof dataValue != 'boolean') {
    return { ...error, message: `expected boolean but received ${typeof dataValue}` };
  } else {
    return null;
  }
}

export function validateObject(
  validationKey: string,
  validation: ModelPropObjectType,
  dataValue: unknown
): ValidationPropError | null {
  const error = {
    key: validationKey,
    message: '',
  };
  if (dataValue == null && validation.optional) {
    return null;
  } else if (dataValue == null || !isPlainObject(dataValue)) {
    return { ...error, message: `expected object but received ${typeof dataValue}` };
  } else {
    if (!validation.shape) {
      return { ...error, message: `missing object shape validator` };
    }
    const shapeKeys = Object.keys(validation.shape);

    const errors: string[] = [];
    for (let i = 0; i < shapeKeys.length; i++) {
      const shapeKey = shapeKeys[i];
      const shapeValidator = validation.shape[shapeKey];
      const res = reducer(shapeKey, shapeValidator, (dataValue as Record<string, unknown>)[shapeKey]);
      if (res) errors.push(`${shapeKey}: ${res.message}`);
    }

    if (errors.length > 0) {
      return { ...error, message: errors.join('\n') };
    } else {
      return null;
    }
  }
}

export function validateArray(
  validationKey: string,
  validation: ModelPropArrayType,
  dataValue: unknown
): ValidationPropError | null {
  const error = {
    key: validationKey,
    message: '',
  };
  if (dataValue == null && validation.optional) {
    return null;
  } else if (dataValue == null || !Array.isArray(dataValue)) {
    return { ...error, message: `expected array but received ${typeof dataValue}` };
  } else {
    if (!validation.of) {
      return { ...error, message: `missing array type` };
    }
    const errors: string[] = [];

    for (let i = 0; i < dataValue.length; i++) {
      const res = reducer(`[${i}]`, validation.of, dataValue[i]);
      if (res) errors.push(`[${i}]: ${res.message}`);
    }

    return errors.length > 0 ? { ...error, message: errors.join('\n') } : null;
  }
}
