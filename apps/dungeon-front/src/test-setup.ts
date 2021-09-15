import 'jest-preset-angular/setup-jest';
import 'jest-extended';
import { MockInstance, ngMocks } from 'ng-mocks';

// ng-mocks setup
  // all methods, getters and setters in mocks are spyied by default
ngMocks.autoSpy('jest');

  // resets customized mock behaviour on afterEach and afterAll events
declare const jasmine: any;
jasmine.getEnv().addReporter({
  specDone: MockInstance.restore,
  specStarted: MockInstance.remember,
  suiteDone: MockInstance.restore,
  suiteStarted: MockInstance.remember
});

// Jest extension

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
