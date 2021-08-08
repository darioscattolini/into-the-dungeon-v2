import { TestBed } from '@angular/core/testing';

import { MonstersService } from './monsters.service';

describe('MonstersService', () => {
  let monstersService: MonstersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MonstersService
      ]
    });
    monstersService = TestBed.inject(MonstersService);
  });

  it('should be created', () => {
    expect(monstersService).toBeTruthy();
  });

  describe('getMonstersPack', () => {
    test('it returns an array', () => {
      expect(monstersService.getMonstersPack()).toBeArray();
    });
  });
});
