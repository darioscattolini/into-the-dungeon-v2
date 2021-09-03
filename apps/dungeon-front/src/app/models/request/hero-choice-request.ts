import { Request } from './request';
import { HeroType, AnyHeroViewData } from '../models';

export class HeroChoiceRequest extends Request<HeroType> {
  public readonly options: AnyHeroViewData[];

  constructor(player: string, options: AnyHeroViewData[]) {
    super(player);
    this.options = options;
  }
}
