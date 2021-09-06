import { 
  AfterContentChecked, ChangeDetectorRef, Component, Input, ViewChild 
} from '@angular/core';
import { SwiperComponent } from 'swiper/angular';
import SwiperCore, { Pagination } from "swiper";
import { BiddingStateViewData } from '../../../models/models';

SwiperCore.use([Pagination]);

@Component({
  selector: 'dungeon-bidding-state',
  templateUrl: './bidding-state.component.html',
  styleUrls: ['./bidding-state.component.scss']
})
export class BiddingStateComponent implements AfterContentChecked {
  @Input() dungeon!: BiddingStateViewData['dungeon'];
  @Input() hero!: BiddingStateViewData['hero'];
  @Input() remainingMonsters!: BiddingStateViewData['remainingMonsters'];
  @Input() remainingPlayers!: BiddingStateViewData['remainingPlayers'];

  @ViewChild('equipmentSwiper') equipmemtSwiper?: SwiperComponent;
  @ViewChild('monsterSwiper') monsterSwiper?: SwiperComponent;

  constructor(private changeDetector: ChangeDetectorRef) {}

  public nextEquipment(): void {
    this.equipmemtSwiper?.swiperRef.slideNext()
  }

  public nextMonster(): void {
    this.monsterSwiper?.swiperRef.slideNext()
  }

  public ngAfterContentChecked() {
    this.changeDetector.detectChanges();
  }

  public previousEquipment(): void {
    this.equipmemtSwiper?.swiperRef.slidePrev()
  }

  public previousMonster(): void {
    this.monsterSwiper?.swiperRef.slidePrev()
  }
}
