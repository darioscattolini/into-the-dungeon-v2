import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

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

  @Output() finished = new EventEmitter<string[]>()

  public nameInputControl = new FormControl('', (control: AbstractControl) => {
    const isRepeated = this.addedNames
      .map(name => name.toLowerCase())
      .includes(control.value.toLowerCase());
    
    return isRepeated ? { repeatedName: control.value } : null;
  });

  @Input() range!: [number, number];

  public get ready(): boolean { 
    return this.addedNames.length >= this.range[0]
      && this.addedNames.length <= this.range[1];
  }

  public repeatedName = false;

  public addPlayer(): void {
    this.addedNames.push(this.nameInputControl.value);
    this.nameInputControl.setValue('');
  }

  public finish(): void {
    this.finished.emit(this.addedNames);
  }

  public removePlayer(name: string): void {
    const index = this.addedNames.indexOf(name);
    this.addedNames.splice(index, 1);
  }
}
