import { Component, Input } from '@angular/core';
import { AnyEquipmentViewData } from '../../../models/models';

@Component({
  selector: 'dungeon-equipment-view',
  templateUrl: './equipment-view.component.html',
  styleUrls: ['./equipment-view.component.scss']
})
export class EquipmentViewComponent {
  public description?: string;
  public effectiveAgainst?: string;
  public hitPoints?: number;
  public image?: string;
  public maxUses?: number | 'Unlimited';
  public name?: string;
  public type?: string;
  
  @Input() set piece(piece: AnyEquipmentViewData) {
    this.displayData(piece);
  }

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
