import createModel from '../src/index';
import { isPlainObject } from '../src/utils';

describe('tests utilities', () => {
  test('confirms if object is an object literal', () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject(null)).toBe(false);
    expect(isPlainObject(undefined)).toBe(false);
    expect(isPlainObject(true)).toBe(false);
    expect(isPlainObject(1)).toBe(false);
    expect(isPlainObject('hello')).toBe(false);
    expect(isPlainObject([1, 2, 3])).toBe(false);
  });
});

describe('tests general rules', () => {
  test('ignores optional keys', () => {
    const model = createModel({
      key: { type: 'string' },
      optionalKey: {
        type: 'number',
        optional: true,
      },
      optionalKey2: {
        type: 'string',
        optional: true,
      },
    });

    expect(model.validate({ key: 'hello world' })).toBe(null);
  });
});

describe('tests validators', () => {
  test('validates string correctly', () => {
    const model = createModel({
      name: {
        type: 'string',
        minLength: 1,
        maxLength: 5,
      },
    });

    expect(model.validate({ name: '' })).toStrictEqual([{ key: 'name', message: 'expected string of length > 0' }]);
    expect(model.validate({ name: '123456' })).toStrictEqual([
      { key: 'name', message: 'expected string of length < "5"' },
    ]);
    expect(model.validate({ name: '123' })).toBe(null);
    expect(model.validate({ name: '1' })).toBe(null);
  });

  test('validates number correctly', () => {});

  test('validates boolean correctly', () => {});

  test('validates array correctly', () => {
    const model = createModel({
      tags: {
        type: 'array',
        of: {
          type: 'string',
          minLength: 3,
        },
      },
    });

    expect(model.validate({ tags: ['lkasdjf', 'alksdjf', 'ksljfd'] })).toBe(null);
    expect(model.validate({ tags: ['lkasdjf', 'alksdjf', 'ksljfd', '1'] })).toStrictEqual([
      { key: 'tags', message: '[3]: expected string of length > "3"' },
    ]);
    expect(model.validate({ tags: ['lkasdjf', 'alksdjf', 'ksljfd', '1', '2'] })).toStrictEqual([
      { key: 'tags', message: '[3]: expected string of length > "3"\n[4]: expected string of length > "3"' },
    ]);
  });

  test('validates object correctly', () => {
    const model = createModel({
      options: {
        type: 'object',
        shape: {
          key0: {
            type: 'number',
          },
          key1: {
            type: 'string',
          },
          key2: {
            type: 'string',
            optional: true,
          },
        },
      },
    });

    expect(model.validate({ options: { key0: 123, key1: 'hello world' } })).toBe(null);
    expect(model.validate({ options: { key0: true, key1: 'hello world' } })).toStrictEqual([
      { key: 'options', message: 'key0: expected number but received boolean' },
    ]);
  });
});
