import { Request } from './request';
import { HeroType, AnyHeroViewData } from '../models';

export class HeroChoiceRequest extends Request<HeroType> {
  public readonly player: string;
  public readonly options: AnyHeroViewData[];

  constructor(player: string, options: AnyHeroViewData[]) {
    super();
    this.player = player;
    this.options = options;
  }
}
