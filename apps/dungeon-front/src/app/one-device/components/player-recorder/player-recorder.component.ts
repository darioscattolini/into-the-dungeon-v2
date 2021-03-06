import { Component, Inject } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PlayersRequest } from '../../../models/models';

@Component({
  selector: 'dungeon-player-recorder',
  templateUrl: './player-recorder.component.html',
  styleUrls: ['./player-recorder.component.scss']
})
export class PlayerRecorderComponent {
  public addedNames: string[] = [];

  public get additionDisabled(): boolean {
    return !this.nameInputControl.value || !this.nameInputControl.valid;
  }

  public nameInputControl = new FormControl('', (control: AbstractControl) => {
    const isRepeated = this.addedNames
      .map(name => name.toLowerCase())
      .includes(control.value.toLowerCase());
    
    return isRepeated ? { repeatedName: control.value } : null;
  });

  public get ready(): boolean { 
    return this.addedNames.length >= this.data.range[0]
      && this.addedNames.length <= this.data.range[1];
  }

  public repeatedName = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PlayersRequest['content']
  ) { }

  public addPlayer(): void {
    this.addedNames.push(this.nameInputControl.value);
    this.nameInputControl.setValue('');
  }

  public removePlayer(name: string): void {
    const index = this.addedNames.indexOf(name);
    this.addedNames.splice(index, 1);
  }
}
