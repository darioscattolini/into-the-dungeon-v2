import { Injectable } from '@angular/core';
import { UiMediatorService } from './ui-mediator.service';
import {
  ChosenWeapon,
  Raid,
  RaidParticipants,
  RaidResult,
  WeaponName
} from '../../models/models';

@Injectable()
export class RaidService {
  
  constructor(private uiMediator: UiMediatorService) { }

  public async playRaid(participants: RaidParticipants): Promise<RaidResult> {
    const raider = participants.raider;
    const raid = new Raid(participants.hero, participants.enemies);

    while (raid.goesOn()) {
      const encounter = raid.getCurrentEncounter();
      const state = raid.state;
          
      let response: ChosenWeapon = 'NO_WEAPON';

      response = await this.uiMediator
        .requestEncounterResolution(raider, encounter, state);
      this.validateResponse(response, encounter.weapons);
      
      const outcome = raid.resolveCurrentEncounter(response);
      await this.uiMediator.notifyEncounterOutcome(raider, outcome);
    }
    
    const survived = raid.heroHitPoints > 0;

    return { raider, survived };
  }

  private validateResponse(response: ChosenWeapon, options: WeaponName[]): void {
    if (response !== 'NO_WEAPON' && !options.includes(response)) {
      throw new Error('Chosen weapon not included among eligible options');
    }
  }
}
