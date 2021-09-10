import { Inject, Injectable } from '@angular/core';
import { EquipmentService } from './equipment.service';
import {
  Hero,
  HeroType,
  heroTypes,
  HeroDataMap,
  HeroDataMapIT,
  EquipmentName,
  AnyHeroViewData,
  HeroViewDataMap,
  HeroViewDataMapIT,
  AnyEquipmentViewData,
  PlayingHeroViewData
} from '../../models/models';

@Injectable()
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

  public getHeroOptions(): AnyHeroViewData[] {
    const options: AnyHeroViewData[] = [];
    
    for (const type of heroTypes) {
      const partialViewData = this.viewData[type];
      const equipmentNames = Array.from(this.data[type].equipment);
      const equipmentViewData = this.getEquipmentViewData(equipmentNames);

      const viewData: AnyHeroViewData = {
        type: partialViewData.type,
        description: partialViewData.description,
        image: partialViewData.image,
        baseHitPoints: partialViewData.baseHitPoints,
        equipment: equipmentViewData
      }

      options.push(viewData);
    }

    return options;
  }

  public getPlayingHeroViewData(hero: Hero): PlayingHeroViewData {
    const partialViewData = this.viewData[hero.type];

    return {
      type: hero.type,
      description: partialViewData.description,
      image: partialViewData.image,
      hitPoints: hero.hitPoints,
      equipment: this.getEquipmentViewData(hero.getMountedEquipment()),
    }
  }

  private getEquipmentViewData(pieces: EquipmentName[]): AnyEquipmentViewData[] {
    const piecesViewData: AnyEquipmentViewData[] = [];

    for (const piece of pieces) {
      const pieceViewData = this.equipmentService.getViewDataFor(piece);
      piecesViewData.push(pieceViewData);
    }

    return piecesViewData;
  }
}
