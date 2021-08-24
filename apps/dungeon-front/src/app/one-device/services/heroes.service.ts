import { Injectable } from '@angular/core';
import { OneDeviceModule } from '../one-device.module';
import { HeroView } from '../../view-data/view-data';
import { Hero, HeroType } from '../../models/models';

@Injectable({
  providedIn: OneDeviceModule
})
export class HeroesService {
  public getHeroOptions(): HeroView[] {
    // minimum required implementation
    return [];
  }

  public createHero(heroType: HeroType): Hero {
    // minimum required implementation
    return new Hero('bard', 6);
  }
}
