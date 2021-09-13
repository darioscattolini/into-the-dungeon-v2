import { Component, Inject, } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EncounterResolutionRequest } from '../../../models/models';

@Component({
  selector: 'dungeon-encounter',
  templateUrl: './encounter.component.html',
  styleUrls: ['./encounter.component.scss']
})
export class EncounterComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EncounterResolutionRequest['content']
  ) { }
}
