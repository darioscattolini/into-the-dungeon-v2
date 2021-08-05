import 'jest-preset-angular/setup-jest';
import 'jest-extended';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      /** 
       * Checks that an array does not have repeated members. For non primitive 
       * values, it checks only for reference identity (different copies of the
       * same object allowed)
       */
      toHaveNoRepeatedMembers(): R;
    }
  }
}

expect.extend({
  toHaveNoRepeatedMembers(received) {
    const pass = Array.isArray(received) 
      && new Set(received).size === received.length;

    if (pass) {
      return {
        message: () => `expected [${received}] array has no repeated members`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected [${received}] array has repeated members`,
        pass: false,
      };
    }
  },
});
