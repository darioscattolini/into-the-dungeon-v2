import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoundResultNotification } from '../../../models/models';

@Component({
  selector: 'dungeon-round-result',
  templateUrl: './round-result.component.html',
  styleUrls: ['./round-result.component.scss']
})
export class RoundResultComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: RoundResultNotification['content']
  ) { }
}
