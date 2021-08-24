import { Injectable } from '@angular/core';
import { OneDeviceModule } from '../one-device.module';
import { 
  Monster, AnyMonster, monsterTypes, monsterData 
} from '../../models/models';

@Injectable({
  providedIn: OneDeviceModule
})
export class MonstersService {
  private monsterTypes = monsterTypes;
  private monsterData = monsterData;

  public getMonstersPack(): AnyMonster[] {
    const pack = this.buildPack();
    this.shuffle(pack);
    return pack;
  }

  private buildPack(): AnyMonster[] {
    const pack: AnyMonster[] = [];

    for (const type of this.monsterTypes) {
      const amount = this.monsterData[type].maxAmount;
      const damage = this.monsterData[type].damage;

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
