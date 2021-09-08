import { Request } from './request';

export class Notification<T> extends Request<boolean> {
  public content: T;

  constructor(player: string, content: T) {
    super(player);
    this.content = content;
  }
}
