import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EncounterOutcomeNotification } from '../../../models/models';

@Component({
  selector: 'dungeon-encounter-outcome',
  templateUrl: './encounter-outcome.component.html',
  styleUrls: ['./encounter-outcome.component.scss']
})
export class EncounterOutcomeComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EncounterOutcomeNotification['content']
  ) { }

  public getHitPointsChange(): string {
    const change = this.data.hitPoints.change;

    if (change > 0) return `+${change}`;
    else if (change < 0) return `-${change}`;
    else return 'unchanged';
  }
}
