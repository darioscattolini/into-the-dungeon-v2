import { HeroType } from '../../models/models';
import { EquipmentViewData } from './equipment-view-data';

export interface HeroViewData<T extends HeroType> {
  readonly type: T;
  readonly image: string;
  readonly description: string;
  readonly equipment: ReadonlyArray<EquipmentViewData>
}

export type AnyHeroViewData = HeroViewData<HeroType>;
