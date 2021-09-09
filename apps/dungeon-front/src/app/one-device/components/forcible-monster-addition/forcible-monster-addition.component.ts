import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ForcibleMonsterAdditionNotification } from '../../../models/models';

@Component({
  selector: 'dungeon-forcible-monster-addition',
  templateUrl: './forcible-monster-addition.component.html',
  styleUrls: ['./forcible-monster-addition.component.scss']
})
export class ForcibleMonsterAdditionComponent {
  public playerNotified = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) 
    public data: ForcibleMonsterAdditionNotification['content']
  ) { }
}
