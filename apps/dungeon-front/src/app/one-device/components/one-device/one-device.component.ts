import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { UiMediatorService } from '../../services/ui-mediator.service';
import { HeroChoiceRequest } from '../../../models/models';
import { HeroSelectComponent } from '../hero-select/hero-select.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'dungeon-one-device',
  templateUrl: './one-device.component.html',
  styleUrls: ['./one-device.component.scss']
})
export class OneDeviceComponent implements OnInit {
  public get playersRequest() {
    return this.uiMediator.playersRequest;
  }

  constructor(
    private gameService: GameService,
    private uiMediator: UiMediatorService,
    private dialog: MatDialog
  ) { }

  public ngOnInit() {
    this.gameService.play(); // no await?
    this.uiMediator.heroChoiceRequest.subscribe(request => {
      this.triggerHeroChoiceRequest(request);
    })
  }

  private triggerHeroChoiceRequest(request: HeroChoiceRequest) {
    const dialogRef = this.dialog.open(HeroSelectComponent, { 
      data: { request },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(hero => {
      request.onResponse(hero);
    });
  }
}
