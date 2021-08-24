import { Injectable } from '@angular/core';
import { OneDeviceModule } from '../one-device.module';
import { Hero, HeroType, AnyHeroViewData } from '../../models/models';

@Injectable({
  providedIn: OneDeviceModule
})
export class HeroesService {
  public getHeroOptions(): AnyHeroViewData[] {
    // minimum required implementation
    return [];
  }

  public createHero(heroType: HeroType): Hero {
    // minimum required implementation
    return new Hero('bard', 6);
  }
}
