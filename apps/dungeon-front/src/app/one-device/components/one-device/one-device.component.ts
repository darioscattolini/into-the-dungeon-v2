import { Component, OnInit, Type } from '@angular/core';
import { GameService } from '../../services/game.service';
import { UiMediatorService } from '../../services/ui-mediator.service';
import { MatDialog } from '@angular/material/dialog';
import { Request } from '../../../models/models';
import { BiddingEndComponent } from '../bidding-end/bidding-end.component';
import { BidParticipationComponent } 
  from '../bid-participation/bid-participation.component';
import { EncounterComponent } from '../encounter/encounter.component';
import { EncounterOutcomeComponent } 
  from '../encounter-outcome/encounter-outcome.component';
import { EquipmentSelectComponent }
  from '../equipment-select/equipment-select.component';
import { ForcibleMonsterAdditionComponent } 
  from '../forcible-monster-addition/forcible-monster-addition.component';
import { MonsterAdditionComponent } 
  from '../monster-addition/monster-addition.component';
import { HeroSelectComponent } from '../hero-select/hero-select.component';
import { PlayerRecorderComponent } 
  from '../player-recorder/player-recorder.component';
import { RoundResultComponent } from '../round-result/round-result.component';

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
    this.subscribeToRequestEmitters();

    this.gameService.play(); // no await?
  }

  private subscribeToRequestEmitters(): void {
    this.uiMediator.biddingEndNotification.subscribe(notification => {
      this.triggerDialogComponent(BiddingEndComponent, notification);
    });

    this.uiMediator.bidParticipationRequest.subscribe(request => {
      this.triggerDialogComponent(BidParticipationComponent, request);
    });

    this.uiMediator.encounterOutcomeNotification.subscribe(notification => {
      this.triggerDialogComponent(EncounterOutcomeComponent, notification)
    });

    this.uiMediator.encounterResolutionRequest.subscribe(request => {
      this.triggerDialogComponent(EncounterComponent, request);
    });

    this.uiMediator.equipmentRemovalRequest.subscribe(request => {
      this.triggerDialogComponent(EquipmentSelectComponent, request);
    });
    
    this.uiMediator.forcibleMonsterAdditionNotification.subscribe(notification => {
      this.triggerDialogComponent(ForcibleMonsterAdditionComponent, notification);
    });
    
    this.uiMediator.heroChoiceRequest.subscribe(request => {
      this.triggerDialogComponent(HeroSelectComponent, request);
    });

    this.uiMediator.monsterAdditionRequest.subscribe(request => {
      this.triggerDialogComponent(MonsterAdditionComponent, request);
    });

    this.uiMediator.playersRequest.subscribe(request => {
      this.triggerDialogComponent(PlayerRecorderComponent, request);
    });

    this.uiMediator.roundResultNotification.subscribe(notification => {
      this.triggerDialogComponent(RoundResultComponent, notification);
    });
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
