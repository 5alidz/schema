import { Model, EmptyObject, ValidationPropError } from './types';
import { reducer } from './validators';
import { isPlainObject } from './utils';

export default function createModel<T extends EmptyObject>(model: Model) {
  if (!isPlainObject(model)) {
    throw new Error('model should be a valid object');
  }

  const modelKeys = Object.keys(model);

  return Object.freeze({
    validate(data: T) {
      if (!isPlainObject(data)) {
        throw new Error('data should be a valid object');
      }

      const errors: ValidationPropError[] = [];

      for (let i = 0; i < modelKeys.length; i++) {
        const key = modelKeys[i];
        const validator = model[key];
        const valueToValidate = data[key];

        if (!isPlainObject(validator) || !validator) {
          throw new Error(`Invalid validator "${key}"`);
        }

        const err = reducer(key, validator, valueToValidate);

        if (err) errors.push(err);
      }

      return errors.length > 0 ? errors : null;
    },
  });
}
