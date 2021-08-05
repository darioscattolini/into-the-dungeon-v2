import { TestBed } from '@angular/core/testing';
import { randomInteger } from '@into-the-dungeon/util-testing';

import { UiMediatorService } from './ui-mediator.service';

describe('UiMediatorService', () => {
  let uiMediator: UiMediatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UiMediatorService
      ]
    });
    uiMediator = TestBed.inject(UiMediatorService);
  });

  it('should be created', () => {
    expect(uiMediator).toBeTruthy();
  });

  describe('notifyError', () => {
    //
  });

  describe('requestPlayersAmount', () => {
    test('it returns a number', async () => {
      const min = randomInteger(4);
      const max = min + 5;
      const rangeDummy: [number, number] = [min, max];
      
      expect.assertions(1);

      const playersAmount = await uiMediator.requestPlayersAmount(rangeDummy);

      expect(playersAmount).toBeNumber();
    });

    // Test validation on ranges (max after min, two numbers, positive)
    // Test return between range
  });

  describe('requestPlayerName', () => {
    test('it returns a string', async () => {
      expect.assertions(1);

      const name = await uiMediator.requestPlayerName();

      expect(name).toBeString();
    });
  });
});
