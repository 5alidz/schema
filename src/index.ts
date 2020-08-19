import { Model, EmptyObject, ValidationPropError } from './types';
import { reducer } from './validators';
import { isPlainObject } from './utils';

export default function createModel<T extends EmptyObject>(model: Model) {
  // satisfiy model object requirements
  if (!isPlainObject(model)) {
    throw new Error('model should be a valid object');
  }

  const modelKeys = Object.keys(model);

  return Object.freeze({
    validate(data: T) {
      // satisfy data shape requirements
      if (!isPlainObject(data)) {
        throw new Error('data should be a valid object');
      }

      const errors: ValidationPropError[] = [];

      for (let i = 0; i < modelKeys.length; i++) {
        const key = modelKeys[i];
        const validator = model[key];
        const valueToValidate = data[key];
        // convert short hand properties to its uniform shape for easier validation handling
        if (!isPlainObject(validator) || !validator) {
          throw new Error(`Invalid validator "${key}"`);
        }
        // safe to assume that validation is an object that satisfy validation types
        const err = reducer(key, validator, valueToValidate);
        if (err) errors.push(err);
      }

      return errors.length > 0 ? errors : null;
    },
  });
}
