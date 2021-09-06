import { Component, Input } from '@angular/core';
import { AnyEquipmentViewData } from '../../../models/models';

@Component({
  selector: 'dungeon-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss']
})
export class EquipmentComponent {
  public description?: string;
  public effectiveAgainst?: string;
  public hitPoints?: number;
  public image?: string;
  public maxUses?: number | 'Unlimited';
  public name?: AnyEquipmentViewData['name'];
  public type?: AnyEquipmentViewData['type'];

  public get protectionMiniDescription(): string {
    const hitPoints = this.hitPoints as number;
    
    return `+${hitPoints} hitpoints`;
  }

  public get weaponMiniDescription(): string {
    const maxUses = this.maxUses as number | 'Unlimited';
    const effectiveAgainst = this.effectiveAgainst as string;
    const description = this.description as string;

    return `${description} Effective against ${effectiveAgainst}. Uses: ${maxUses}`;
  }
  
  @Input() set piece(piece: AnyEquipmentViewData) {
    this.displayData(piece);
  }

  @Input() miniComponent = false;
  @Input() smallComponent = false;

  private displayData(data: AnyEquipmentViewData) {
    this.name = data.name;
    this.type = data.type;
    this.image = data.image;
    this.description = data.description;

    if (data.type === 'protection') {
      this.hitPoints = data.hitPoints;
    } else {
      this.effectiveAgainst = data.effectiveAgainst.join(', ');
      this.maxUses = data.availableUses === Infinity 
        ? 'Unlimited' 
        : data.availableUses;
    }
  }
}
