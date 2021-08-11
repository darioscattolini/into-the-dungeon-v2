export class Player {
  public readonly name: string;

  constructor(name: string) {
    if (name === '') {
      throw new Error('Player\'s names should have at least one character');
    }

    this.name = name;
  }
}
