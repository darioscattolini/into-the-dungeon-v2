import { Inject, Injectable } from '@angular/core';
import { OneDeviceModule } from '../one-device.module';
import { EquipmentService } from './equipment.service';
import { 
  Hero, HeroType, heroTypes, HeroDataMap, HeroDataMapIT, 
  AnyHeroViewData, HeroViewDataMap, HeroViewDataMapIT, AnyEquipmentViewData
} from '../../models/models';

@Injectable({
  providedIn: OneDeviceModule
})
export class HeroesService {
  private data: HeroDataMap;
  private viewData: HeroViewDataMap;

  constructor(
    @Inject(HeroDataMapIT) heroData: HeroDataMap,
    @Inject(HeroViewDataMapIT) heroViewDataMap: HeroViewDataMap,
    private equipmentService: EquipmentService
  ) {
    this.data = heroData;
    this.viewData = heroViewDataMap;
  }

  public getHeroOptions(): AnyHeroViewData[] {
    const options: AnyHeroViewData[] = [];
    
    for (const type of heroTypes) {
      const partialViewData = this.viewData[type];
      const equipment: AnyEquipmentViewData[] = [];

      for (const pieceName of this.data[type].equipment) {
        const pieceViewData = this.equipmentService.getViewDataFor(pieceName);
        equipment.push(pieceViewData);
      }

      const viewData: AnyHeroViewData = {
        type: partialViewData.type,
        description: partialViewData.description,
        image: partialViewData.image,
        equipment
      }

      options.push(viewData);
    }

    return options;
  }

  public createHero(type: HeroType): Hero {
    const data = this.data[type];
    const hitPoints = data.hitPoints;
    const hero = new Hero(type, hitPoints);
    
    for (const pieceName of data.equipment) {
      const piece = this.equipmentService.createPiece(pieceName);
      hero.mountEquipmentPiece(piece);
    }

    return hero;
  }
}
