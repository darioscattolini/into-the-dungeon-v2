/**
 * Builds a random integer between 0 and 10000. This value can be used for
 * mocking.
 * 
 * @returns number
 */
export function randomInteger(): number {
  return Math.round(Math.random() * 10000);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
type ConcreteConstructor<T = {}> = new(...args: any[]) => T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
type AbstractConstructor<T = {}> = abstract new(...args: any[]) => T;

// eslint-disable-next-line @typescript-eslint/ban-types
type Constructor<T = {}> = ConcreteConstructor<T> | AbstractConstructor<T>;

// eslint-disable-next-line @typescript-eslint/ban-types
type WithId<T extends {}> = T & { readonly uniqueId: symbol };

/**
 * Builds an extension of the provided class with an additional property called
 * `uniqueId` of type `Symbol`, which uniquely identifies a class instance. 
 * This can help create test doubles that don't incur in false positives in 
 * matchers that check for equality rather than identity of objects. 
 * 
 * Example:
 * 
 * `const mockInstance = new (Identified(MockUser))();`
 * 
 * @param BaseClass Constructor
 * @returns ConcreteConstructor
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function Identified<T extends object>(BaseClass: Constructor<T>) {
    return class Unique extends BaseClass /*implements IUnique<T>*/ {
      public readonly uniqueId = Symbol();
    } as ConcreteConstructor<WithId<T>>;
  }
