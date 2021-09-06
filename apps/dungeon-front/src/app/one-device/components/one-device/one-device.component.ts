import { Component, OnInit, Type } from '@angular/core';
import { GameService } from '../../services/game.service';
import { UiMediatorService } from '../../services/ui-mediator.service';
import { MatDialog } from '@angular/material/dialog';
import { Request } from '../../../models/models';
import { 
  BidParticipationComponent 
} from '../bid-participation/bid-participation.component';
import { HeroSelectComponent } from '../hero-select/hero-select.component';
import { 
  PlayerRecorderComponent 
} from '../player-recorder/player-recorder.component';

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
    this.uiMediator.bidParticipationRequest.subscribe(request => {
      this.triggerDialogComponent(BidParticipationComponent, request);
    });

    this.uiMediator.playersRequest.subscribe(request => {
      this.triggerDialogComponent(PlayerRecorderComponent, request);
    });

    this.uiMediator.heroChoiceRequest.subscribe(request => {
      this.triggerDialogComponent(HeroSelectComponent, request);
    });

    this.gameService.play(); // no await?
  }

  private triggerDialogComponent<T>(Component: Type<any>, request: Request<T>) {
    const dialogRef = this.dialog.open(Component, { 
      data: { request },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(response => {
      request.onResponse(response);
    });
  }
}
