import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { UiMediatorService } from '../../services/ui-mediator.service';

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
    private uiMediator: UiMediatorService
  ) { }

  public ngOnInit() {
    this.gameService.play(); // no await?
  }
}
