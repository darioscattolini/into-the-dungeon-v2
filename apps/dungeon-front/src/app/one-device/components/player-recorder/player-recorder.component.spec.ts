import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

import { PlayerRecorderComponent } from './player-recorder.component';

@Component({
  selector: 'dungeon-host-component',
  template: '<dungeon-player-recorder [range]="[2, 4]"></dungeon-player-recorder>'
})
class HostComponent {}

describe('PlayerRecorderComponent', () => {
  let component: PlayerRecorderComponent;
  let hostComponent: HostComponent;
  let hostFixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerRecorderComponent, HostComponent ],
      schemas: [ NO_ERRORS_SCHEMA ] // to avoid complaints on non imported children components
    })
    .compileComponents();
  });

  beforeEach(() => {
    hostFixture = TestBed.createComponent(HostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
    component = hostFixture.nativeElement.querySelector('dungeon-player-recorder');
  });

  test('it is created', () => {
    expect(component).toBeTruthy();
  });
});

/**
 * Tests from PlayersService:
 * -It is created
 * -Players amount within range
 * -Name uniqueness: disables addition, notifies error, returned names are unique
 * -Return arrays of strings, expected length and expected names
 */
