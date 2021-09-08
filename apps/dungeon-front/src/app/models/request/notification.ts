import { Request } from './request';

export class Notification<T> extends Request<boolean> {
  public content: T;
  public player: string;

  constructor(player: string, content: T) {
    super();
    this.content = content;
    this.player = player;
  }
}
