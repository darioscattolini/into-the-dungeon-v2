import { TestBed } from '@angular/core/testing';

import { RaidService } from './raid.service';
import { RaidParticipants, Player } from '../../models/models';
import { 
  PlayerDouble, HeroDouble, MonsterDouble
} from '../../models/test-doubles';

describe('RaidService', () => {
  let raidService: RaidService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RaidService
      ]
    });
    raidService = TestBed.inject(RaidService);
  });

  it('should be created', () => {
    expect(raidService).toBeTruthy();
  });

  describe('playRaid', () => {
    let participantsDummy: RaidParticipants;

    beforeEach(() => {
      const raider = PlayerDouble.createDouble();
      const hero = HeroDouble.createDouble();
      const enemies = [
        MonsterDouble.createDouble(),
        MonsterDouble.createDouble(),
        MonsterDouble.createDouble()
      ];

      participantsDummy = { raider, hero, enemies };
    });

    test('it returns an instance of RaidResult', async () => {
      expect.assertions(2);

      const raidResult = await raidService.playRaid(participantsDummy);

      expect(raidResult.raider).toBeInstanceOf(Player);
      expect(raidResult.survived).toBeBoolean();
    });
  });
});
