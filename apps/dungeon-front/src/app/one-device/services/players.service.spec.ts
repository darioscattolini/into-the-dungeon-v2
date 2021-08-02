import { TestBed } from '@angular/core/testing';

import { PlayersService } from './players.service';
import { AddedPlayers, PlayerRequirements } from '../../models/models';
import { buildPlayerRequirementsDummy } from '../../models/test-doubles';

describe('PlayersService', () => {
  let playersService: PlayersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PlayersService
      ]
    });
    playersService = TestBed.inject(PlayersService);
  });

  it('should be created', () => {
    expect(playersService).toBeTruthy();
  });

  describe('getJoiningPlayers', () => {
    let requirementsDummy: PlayerRequirements;
    
    beforeEach(() => {
      requirementsDummy = buildPlayerRequirementsDummy();
    });

    test('it returns an instance of AddedPlayers', async () => {
      expect.assertions(1);

      const addedPlayers = 
        await playersService.getJoiningPlayers(requirementsDummy);

      expect(addedPlayers).toBeInstanceOf(AddedPlayers);
    });
  });
});
