import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BiddingEndNotification } from '../../../models/models';

@Component({
  selector: 'dungeon-bidding-end',
  templateUrl: './bidding-end.component.html',
  styleUrls: ['./bidding-end.component.scss']
})
export class BiddingEndComponent{
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: BiddingEndNotification['content']
  ) { }
}
