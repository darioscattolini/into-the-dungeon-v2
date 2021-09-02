import { 
  Component, InjectionToken, Inject, Input, ViewChild 
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SwiperComponent } from 'swiper/angular';
import SwiperCore, { Pagination } from "swiper";
import { AnyHeroViewData, HeroChoiceRequest } from '../../../models/models';

SwiperCore.use([Pagination]);

type HeroSelectDialogRef = MatDialogRef<HeroSelectComponent>;

const MAT_DIALOG_REF = new InjectionToken<HeroSelectDialogRef>('matDialogRef');

@Component({
  selector: 'dungeon-hero-select',
  templateUrl: './hero-select.component.html',
  styleUrls: ['./hero-select.component.scss']
})
export class HeroSelectComponent {
  public Infinity = Infinity;
  public playerNotified = false;
  
  @Input() player?: string;
    
  @ViewChild(SwiperComponent) swiper?: SwiperComponent;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { request: HeroChoiceRequest },
    @Inject(MAT_DIALOG_REF) private dialogRef: HeroSelectDialogRef
  ) {}

  public calculateEquipmentHitPoints(hero: AnyHeroViewData): number {
    return hero.equipment.reduce((accum, piece) => {
      return piece.type === 'protection' ? accum + piece.hitPoints : accum;
    }, 0);
  }

  public chooseHero(): void {
    const heroIndex = this.swiper?.swiperRef.realIndex as number;
    const hero = this.data.request.options[heroIndex].type;
    this.dialogRef.close(hero);
  }

  public nextHero(): void {
    this.swiper?.swiperRef.slideNext()
  }

  public previousHero(): void {
    this.swiper?.swiperRef.slidePrev()
  }
}
