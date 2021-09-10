import { Component, OnInit, Type } from '@angular/core';
import { GameService } from '../../services/game.service';
import { UiMediatorService } from '../../services/ui-mediator.service';
import { MatDialog } from '@angular/material/dialog';
import { Request } from '../../../models/models';
import { BiddingEndComponent } from '../bidding-end/bidding-end.component';
import { BidParticipationComponent } 
  from '../bid-participation/bid-participation.component';
import { ForcibleMonsterAdditionComponent } 
  from '../forcible-monster-addition/forcible-monster-addition.component';
import { HeroSelectComponent } from '../hero-select/hero-select.component';
import { PlayerRecorderComponent } 
  from '../player-recorder/player-recorder.component';

@Component({
  selector: 'dungeon-one-device',
  templateUrl: './one-device.component.html',
  styleUrls: ['./one-device.component.scss']
})
export class OneDeviceComponent implements OnInit {
  constructor(
    private gameService: GameService,
    private uiMediator: UiMediatorService,
    private dialog: MatDialog
  ) { }

  public ngOnInit() {
    this.uiMediator.biddingEndNotification.subscribe(request => {
      this.triggerDialogComponent(BiddingEndComponent, request);
    });

    this.uiMediator.bidParticipationRequest.subscribe(request => {
      this.triggerDialogComponent(BidParticipationComponent, request);
    });  
    
    this.uiMediator.forcibleMonsterAdditionNotification.subscribe(request => {
      this.triggerDialogComponent(ForcibleMonsterAdditionComponent, request);
    });
    
    this.uiMediator.heroChoiceRequest.subscribe(request => {
      this.triggerDialogComponent(HeroSelectComponent, request);
    });

    this.uiMediator.playersRequest.subscribe(request => {
      this.triggerDialogComponent(PlayerRecorderComponent, request);
    });

    this.gameService.play(); // no await?
  }

  private triggerDialogComponent(Component: Type<any>, request: Request<any, any>) {
    const dialogRef = this.dialog.open(Component, { 
      data: request.content,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(response => {
      request.resolve(response);
    });
  }
}
