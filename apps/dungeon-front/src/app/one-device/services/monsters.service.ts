import { Injectable, Inject } from '@angular/core';
import { 
  Monster, AnyMonster, MonsterType, monsterTypes, 
  MonsterDataMap, MonsterDataMapIT, MonsterViewDataMap, MonsterViewDataMapIT
} from '../../models/models';

@Injectable()
export class MonstersService {
  private data: MonsterDataMap;
  private monsterTypes = monsterTypes;
  private viewData: MonsterViewDataMap;
  
  constructor(
    @Inject(MonsterDataMapIT) monsterDataMap: MonsterDataMap,
    @Inject(MonsterViewDataMapIT) monsterViewDataMap: MonsterViewDataMap
  ) {
    this.data = monsterDataMap;
    this.viewData = monsterViewDataMap;
  }

  public getMonstersPack(): AnyMonster[] {
    const pack = this.buildPack();
    this.shuffle(pack);
    return pack;
  }

  public getViewDataFor<T extends MonsterType>(name: T): MonsterViewDataMap[T] {
    return this.viewData[name];
  }

  private buildPack(): AnyMonster[] {
    const pack: AnyMonster[] = [];

    for (const type of this.monsterTypes) {
      const amount = this.data[type].maxAmount;
      const damage = this.data[type].damage;

      for (let i = 0; i < amount; i++) {
        const monsterInstance = new Monster(type, damage);
        pack.push(monsterInstance);
      }
    }

    return pack;
  }

  private shuffle(pack: AnyMonster[]): void {
    for (let i = pack.length - 1; i >= 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      const stored = pack[randomIndex];
      pack[randomIndex] = pack[i];
      pack[i] = stored;
    }
  }
}
