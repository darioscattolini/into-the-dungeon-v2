// eslint-disable-next-line @typescript-eslint/ban-types
type ConcreteConstructor = new(...args: unknown[]) => {};

// eslint-disable-next-line @typescript-eslint/ban-types
type AbstractConstructor = abstract new(...args: unknown[]) => {};

// eslint-disable-next-line @typescript-eslint/ban-types
type Constructor = ConcreteConstructor | AbstractConstructor;

/**
 * Builds a random integer between 0 and 10000. This value can be used for
 * mocking.
 * 
 * @returns number
 */
export function randomInteger(): number {
  return Math.round(Math.random() * 10000);
}

/**
 * Builds an extension of the provided class with an additional property called
 * `uniqueId` of type `Symbol`, which uniquely identifies a class instance. 
 * This can help create test doubles that don't incur in false positives in 
 * matchers that check for equality rather than identity of objects. 
 * 
 * Example:
 * 
 * `const mockInstance = new (Unique(MockUser))();`
 * 
 * @param BaseClass Constructor
 * @returns ConcreteConstructor
 */
export function Unique(BaseClass: Constructor): ConcreteConstructor {
    return class extends BaseClass {
      public readonly mockId = Symbol();
    };
  }
