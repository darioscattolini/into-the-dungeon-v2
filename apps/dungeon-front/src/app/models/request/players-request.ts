import { Request } from './request';

export class PlayersRequest extends Request<string[]> {
  public readonly range: [number, number];

  constructor(range: [number, number]) {
    super();
    this.range = range;
  }
}
