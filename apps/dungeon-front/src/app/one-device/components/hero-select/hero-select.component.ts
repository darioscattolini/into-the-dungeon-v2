import { 
  Component, Inject, ViewChild, ChangeDetectorRef, AfterContentChecked 
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SwiperComponent } from 'swiper/angular';
import SwiperCore, { Pagination } from "swiper";
import { AnyHeroViewData, HeroChoiceRequest } from '../../../models/models';

SwiperCore.use([Pagination]);

@Component({
  selector: 'dungeon-hero-select',
  templateUrl: './hero-select.component.html',
  styleUrls: ['./hero-select.component.scss']
})
export class HeroSelectComponent implements AfterContentChecked {
  public get currentHero() {
    const heroIndex = this.swiper?.swiperRef.realIndex as number;
    const hero = this.data.options[heroIndex].type;

    return hero;
  }

  public Infinity = Infinity;
  public playerNotified = false;
      
  @ViewChild(SwiperComponent) swiper?: SwiperComponent;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: HeroChoiceRequest['content'],
    private changeDetector: ChangeDetectorRef
  ) {}

  public calculateEquipmentHitPoints(hero: AnyHeroViewData): number {
    return hero.equipment.reduce((accum, piece) => {
      return piece.type === 'protection' ? accum + piece.hitPoints : accum;
    }, 0);
  }

  public nextHero(): void {
    this.swiper?.swiperRef.slideNext()
  }

  public ngAfterContentChecked() {
    this.changeDetector.detectChanges();
  }

  public previousHero(): void {
    this.swiper?.swiperRef.slidePrev()
  }
}
