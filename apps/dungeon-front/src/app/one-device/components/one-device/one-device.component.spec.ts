import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneDeviceComponent } from './one-device.component';
import { UiMediatorService } from '../../services/ui-mediator.service';
import { GameService } from '../../services/game.service';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import {
  BiddingEndNotification,
  BidParticipationRequest,
  EncounterOutcomeNotification,
  EncounterResolutionRequest,
  EquipmentRemovalRequest,
  ForcibleMonsterAdditionNotification,
  HeroChoiceRequest,
  MonsterAdditionRequest,
  PlayersRequest,
  RoundResultNotification
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
      value: new Subject<BiddingEndNotification>()
    });

    Object.defineProperty(uiMediator, 'bidParticipationRequest', {
      value: new Subject<BidParticipationRequest>()
    });

    Object.defineProperty(uiMediator, 'encounterOutcomeNotification', {
      value: new Subject<EncounterOutcomeNotification>()
    });

    Object.defineProperty(uiMediator, 'encounterResolutionRequest', {
      value: new Subject<EncounterResolutionRequest>()
    });

    Object.defineProperty(uiMediator, 'equipmentRemovalRequest', {
      value: new Subject<EquipmentRemovalRequest>()
    });

    Object.defineProperty(uiMediator, 'forcibleMonsterAdditionNotification', {
      value: new Subject<ForcibleMonsterAdditionNotification>()
    });

    Object.defineProperty(uiMediator, 'heroChoiceRequest', {
      value: new Subject<HeroChoiceRequest>()
    });

    Object.defineProperty(uiMediator, 'monsterAdditionRequest', {
      value: new Subject<MonsterAdditionRequest>()
    });

    Object.defineProperty(uiMediator, 'playersRequest', {
      value: new Subject<PlayersRequest>()
    });

    Object.defineProperty(uiMediator, 'roundResultNotification', {
      value: new Subject<RoundResultNotification>()
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
