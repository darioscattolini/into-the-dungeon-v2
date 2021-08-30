import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneDeviceComponent } from './one-device.component';
import { UiMediatorService } from '../../services/ui-mediator.service';
import { GameService } from '../../services/game.service';

jest.mock('../../services/ui-mediator.service');
jest.mock('../../services/game.service');

describe('OneDeviceComponent', () => {
  let component: OneDeviceComponent;
  let fixture: ComponentFixture<OneDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OneDeviceComponent ],
      providers: [ 
        UiMediatorService,
        GameService 
      ]
    }).compileComponents();
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
