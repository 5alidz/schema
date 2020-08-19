export function isPlainObject(maybeObject: unknown) {
  return (
    typeof maybeObject == 'object' &&
    maybeObject != null &&
    maybeObject.constructor == Object &&
    Object.prototype.toString.call(maybeObject) == '[object Object]'
  );
}
