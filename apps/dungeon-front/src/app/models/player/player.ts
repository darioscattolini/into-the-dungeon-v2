export class Player {
  public readonly name: string;

  constructor(name: string) {
    // validation on empty names: add here in case of bug, real check in form component
    this.name = name;
  }
}
