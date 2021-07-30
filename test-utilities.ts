type ConcreteConstructor = new(...args: any[]) => {};
type AbstractConstructor = abstract new(...args: any[]) => {};
type Constructor = ConcreteConstructor | AbstractConstructor;

/**
 * Builds a random integer between 0 and 10000. This value can be used for
 * mocking.
 * 
 * @returns number
 */
declare function randomInteger(): number;

global.randomInteger = () => Math.round(Math.random() * 10000);

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
declare function Unique(BaseClass: Constructor): ConcreteConstructor;

global.Unique = 
  <Base extends Constructor>(BaseClass: Base): ConcreteConstructor => {
    return class extends BaseClass {
      public readonly mockId = Symbol();
    };
  }
