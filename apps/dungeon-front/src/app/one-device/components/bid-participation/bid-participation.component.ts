import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BidParticipationRequest } from '../../../models/models';

@Component({
  selector: 'dungeon-bid-participation',
  templateUrl: './bid-participation.component.html',
  styleUrls: ['./bid-participation.component.scss']
})
export class BidParticipationComponent {
  public playerNotified = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { request: BidParticipationRequest }
  ) { }

}
