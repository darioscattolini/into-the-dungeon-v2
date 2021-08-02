import { TestBed } from '@angular/core/testing';

import { BiddingService } from './bidding.service';
import { Player, Hero, EquipmentPack, Monster } from '../../models/models';
import { PlayerDouble } from '../../models/test-doubles';

describe('BiddingService', () => {
  let biddingService: BiddingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BiddingService
      ]
    });
    biddingService = TestBed.inject(BiddingService);
  });

  it('should be created', () => {
    expect(biddingService).toBeTruthy();
  });

  describe('playBidding', () => {
    let playersDummy: Player[];
    let starterDummy: Player;

    beforeEach(() => {
      playersDummy = [
        PlayerDouble.createDouble(), 
        PlayerDouble.createDouble(), 
        PlayerDouble.createDouble()
      ];

      const randomIndex = Math.floor(Math.random() * playersDummy.length);
      starterDummy = playersDummy[randomIndex];
    });

    test('it returns an instance of BiddingResult', async () => {
      expect.assertions(6);

      const biddingResult = 
        await biddingService.playBidding(playersDummy, starterDummy);

      expect(biddingResult).toContainAllKeys([
        'raider', 'hero', 'equipment', 'enemies'
      ]);
      expect(biddingResult.raider).toBeInstanceOf(Player);
      expect(biddingResult.hero).toBeInstanceOf(Hero);
      expect(biddingResult.equipment).toBeInstanceOf(EquipmentPack);
      expect(biddingResult.enemies).toBeArray();
      expect(biddingResult.enemies).toSatisfyAll(e => e instanceof Monster);
    });
  });
});
