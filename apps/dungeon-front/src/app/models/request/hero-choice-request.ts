import { Request } from './request';
import { HeroType, AnyHeroViewData } from '../models';

export class HeroChoiceRequest extends Request<HeroType> {
  public readonly options: AnyHeroViewData[];
  public readonly player: string;

  constructor(player: string, options: AnyHeroViewData[]) {
    super();
    this.options = options;
    this.player = player;
  }
}
