import { WeaponName } from '../../equipment-name';
import { BaseEquipmentViewData } from '../../equipment-view-data';
import { MonsterType } from '../../../models';

export interface WeaponViewData<T extends WeaponName> 
  extends BaseEquipmentViewData<T> {
    readonly name: T;
    readonly type: 'weapon';
    readonly availableUses: number;
    readonly effectiveAgainst: ReadonlyArray<MonsterType>;
}
