import { 
  EquipmentName, ProtectionName, WeaponName, MonsterType 
} from '../../models/models';

interface BaseEquipmentViewData<T extends EquipmentName> {
  readonly name: T;
  readonly image: string;
  readonly description: string;
  readonly type: 'protection' | 'weapon';
}

interface ProtectionViewData<T extends ProtectionName> 
  extends BaseEquipmentViewData<T> {
    readonly name: T;
    readonly type: 'protection';
    readonly hitPoints: number;
}

interface WeaponViewData<T extends WeaponName> 
  extends BaseEquipmentViewData<T> {
    readonly name: T;
    readonly type: 'weapon';
    readonly availableUses: number;
    readonly effectiveAgainst: ReadonlyArray<MonsterType>;
}

export type EquipmentViewData<T extends EquipmentName> 
  = T extends ProtectionName 
    ? ProtectionViewData<T>
    : T extends WeaponName
    ? WeaponViewData<T>
    : never;

export type AnyEquipmentViewData = EquipmentViewData<EquipmentName>;
