import { Component, Input } from '@angular/core';
import { AnyMonsterViewData } from '../../../models/models';

@Component({
  selector: 'dungeon-monster',
  templateUrl: './monster.component.html',
  styleUrls: ['./monster.component.scss']
})
export class MonsterComponent {
  public name?: AnyMonsterViewData['name'];
  public image?: AnyMonsterViewData['image'];
  public damage?: AnyMonsterViewData['damage'];
  public description?: AnyMonsterViewData['description'];

  @Input() miniComponent = false;
  @Input() smallComponent = false;

  @Input() set monster(monster: AnyMonsterViewData) {
    this.displayData(monster);
  }

  private displayData(monster: AnyMonsterViewData): void {
    this.name = monster.name;
    this.image = monster.image;
    this.damage = monster.damage;
    this.description = monster.description;
  }
}
