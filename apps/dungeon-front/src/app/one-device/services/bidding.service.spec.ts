import { TestBed } from '@angular/core/testing';

import { BiddingService } from './bidding.service';
import { Player, BiddingPlayersRound, Hero, Monster } from '../../models/models';
import { BiddingPlayersRoundDouble } from '../../models/test-doubles';

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
    let playersDummy: BiddingPlayersRound;

    beforeEach(() => {
      playersDummy = BiddingPlayersRoundDouble.createDouble();
    });

    test('it returns an instance of BiddingResult', async () => {
      expect.assertions(5);

      const biddingResult = 
        await biddingService.playBidding(playersDummy);

      expect(biddingResult).toContainAllKeys(['raider', 'hero', 'enemies']);
      expect(biddingResult.raider).toBeInstanceOf(Player);
      expect(biddingResult.hero).toBeInstanceOf(Hero);
      expect(biddingResult.enemies).toBeArray();
      expect(biddingResult.enemies).toSatisfyAll(e => e instanceof Monster);
    });
  });
});
