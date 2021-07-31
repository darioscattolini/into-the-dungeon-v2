/**
 * Decorator used to specify the static interface a class must implement.
 * 
 * Example:
 * `@staticImplements<Singleton>() class MyService()`
 * 
 * @returns function
 */
export function staticImplements<T>() {
  return <U extends T>(constructor: U) => constructor;
}
