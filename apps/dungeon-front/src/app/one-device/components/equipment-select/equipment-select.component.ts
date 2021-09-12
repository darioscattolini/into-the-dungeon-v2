import { 
  AfterContentChecked, 
  ChangeDetectorRef, 
  Component, 
  Inject, 
  ViewChild 
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SwiperComponent } from 'swiper/angular';
import SwiperCore, { Pagination } from "swiper";
import { EquipmentName, EquipmentRemovalRequest } from '../../../models/models';

SwiperCore.use([Pagination]);

@Component({
  selector: 'dungeon-equipment-select',
  templateUrl: './equipment-select.component.html',
  styleUrls: ['./equipment-select.component.scss']
})
export class EquipmentSelectComponent implements AfterContentChecked {
  public get currentPiece(): EquipmentName {
    const pieceIndex = this.swiper?.swiperRef.realIndex as number;
    const piece = this.data.state.hero.equipment[pieceIndex].name;

    return piece;
  }

  public playerNotified = false;

  @ViewChild(SwiperComponent) swiper?: SwiperComponent;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EquipmentRemovalRequest['content'],
    private changeDetector: ChangeDetectorRef
  ) { }

  public nextPiece(): void {
    this.swiper?.swiperRef.slideNext()
  }

  public ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  public previousPiece(): void {
    this.swiper?.swiperRef.slidePrev()
  }
}
