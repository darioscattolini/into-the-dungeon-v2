import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneDeviceComponent } from './one-device.component';
import { UiMediatorService } from '../../services/ui-mediator.service';
import { GameService } from '../../services/game.service';
import { MatDialog } from '@angular/material/dialog';
import { EventEmitter } from '@angular/core';
import {
  BiddingEndNotification,
  ForcibleMonsterAdditionNotification,
  BidParticipationRequest,
  HeroChoiceRequest,
  PlayersRequest
} from '../../../models/models';

jest.mock('../../services/ui-mediator.service');
jest.mock('../../services/game.service');
jest.mock('@angular/material/dialog');

describe('OneDeviceComponent', () => {
  let component: OneDeviceComponent;
  let fixture: ComponentFixture<OneDeviceComponent>;
  let uiMediator: UiMediatorService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OneDeviceComponent],
      providers: [UiMediatorService, GameService, MatDialog]
    }).compileComponents();

    uiMediator = TestBed.inject(UiMediatorService);

    Object.defineProperty(uiMediator, 'biddingEndNotification', {
      value: new EventEmitter<BiddingEndNotification>()
    });

    Object.defineProperty(uiMediator, 'bidParticipationRequest', {
      value: new EventEmitter<BidParticipationRequest>()
    });

    Object.defineProperty(uiMediator, 'forcibleMonsterAdditionNotification', {
      value: new EventEmitter<ForcibleMonsterAdditionNotification>()
    });

    Object.defineProperty(uiMediator, 'heroChoiceRequest', {
      value: new EventEmitter<HeroChoiceRequest>()
    });

    Object.defineProperty(uiMediator, 'playersRequest', {
      value: new EventEmitter<PlayersRequest>()
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OneDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('it is created', () => {
    expect(component).toBeTruthy();
  });
});
