import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MonsterAdditionRequest } from '../../../models/models';

@Component({
  selector: 'dungeon-monster-addition',
  templateUrl: './monster-addition.component.html',
  styleUrls: ['./monster-addition.component.scss']
})
export class MonsterAdditionComponent {
  public playerNotified = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) 
    public data: MonsterAdditionRequest['content']
  ) { }
}
