import {
  Player,
  PlayerRequirements,
  BiddingPlayersRound,
  BiddingActionRequestData,
  Hero,
  HeroType,
  heroTypes,
  AnyHeroViewData,
  PlayingHeroViewData,
  EquipmentName,
  equipmentNames,
  AnyEquipmentViewData,
  equipmentViewDataMap,
  Weapon,
  WeaponName,
  weaponNames,
  WeaponEffects,
  Protection,
  ProtectionName,
  protectionNames,
  Monster,
  AnyMonster,
  MonsterType,
  monsterTypes,
  MonsterViewData
} from './models';

import {
  TestDouble,
  TestDoubleClass,
  Identified,
  randomInteger,
  randomString
} from '@into-the-dungeon/util-testing';

import { staticImplements } from '@into-the-dungeon/util-common';

// this appears no have no effect on modules importing doubles
jest.mock('./player/player');
jest.mock('./game-mechanics/bidding/bidding-players-round');
// jest.mock('./hero/hero');
// jest.mock('./monster/monster');

@staticImplements<TestDoubleClass<Player>>()
class PlayerDouble {
  private constructor() {
    //
  }

  public static buildRequirementsDouble(): PlayerRequirements {
    const randomAmount = randomInteger(5);
        
    return {
      min: randomAmount + 2,
      max: randomAmount + 5
    };
  }

  public static createDouble(): TestDouble<Player> {
    const name = randomString(6);
    return new (Identified(Player))(name);
  }
}

@staticImplements<TestDoubleClass<BiddingPlayersRound>>()
class BiddingPlayersRoundDouble {
  private constructor() {
    //
  }

  public static createDouble(): TestDouble<BiddingPlayersRound> {
    return new (Identified(BiddingPlayersRound))([], 0);
  }
}

@staticImplements<TestDoubleClass<Hero>>()
class HeroDouble {
  private constructor() {
    //
  }

  public static createDouble(): TestDouble<Hero> {
    const types: HeroType[] = ['bard', 'mage', 'ninja', 'princess'];
    const type = types[randomInteger(types.length, false)];
    const hitPoints = randomInteger(5);

    return new (Identified(Hero))(type, hitPoints);
  }
  
  public static createStartingHeroViewDataDouble(): AnyHeroViewData {
    return {
      type: this.pickType(),
      image: randomString(5),
      description: randomString(10),
      baseHitPoints: randomInteger(5),
      equipment: EquipmentDouble.buildViewDataDummy()
    };
  }

  public static createPlayingHeroViewDataDouble(): PlayingHeroViewData {
    return {
      type: this.pickType(),
      image: randomString(5),
      description: randomString(10),
      hitPoints: randomInteger(5),
      equipment: EquipmentDouble.buildViewDataDummy()
    };
  }

  public static pickType(): HeroType {
    const types = heroTypes;
    const randomIndex = randomInteger(heroTypes.length, false);
    
    return types[randomIndex];
  }
}

class EquipmentDouble {
  private constructor() {
    //
  }
  
  public static buildViewDataDummy(): AnyEquipmentViewData[] {
    return this.pickNames(6).reduce((pieces, pieceName) => {
      pieces.push(equipmentViewDataMap[pieceName]);
  
      return pieces;
    }, [] as AnyEquipmentViewData[]);
  }
  
  public static pickNames(amount: number, unique = true): EquipmentName[] {
    const options = Array.from(equipmentNames);
    
    return buildRandomArray(options, amount, unique);
  }
}

@staticImplements<TestDoubleClass<Weapon>>()
class WeaponDouble {
  private constructor() {
    //
  }

  public static buildEffectsDouble(): WeaponEffects {
    const targets = MonsterDouble.pickTypes(randomInteger(6));
    const effects: WeaponEffects = { };
  
    for (const target of targets) {
      const effect = randomInteger(10);
      effects[target] = (damage: number) => effect * damage;
    }
  
    return effects;
  }

  public static createDouble(): TestDouble<Weapon> {
    const [name] = this.pickNames(1);

    return this.createSpecificDouble(name);
  }

  public static createDoublesSet(
    amount: number, unique = true
  ): TestDouble<Weapon>[] {
    const names = this.pickNames(amount, unique);
    return names.map(name => this.createSpecificDouble(name));
  }

  public static createSpecificDouble(name: WeaponName): TestDouble<Weapon> {
    const availableUses = randomInteger(3);

    return new (Identified(Weapon))(name, availableUses, {});
  }

  public static pickNames(amount: number, unique = true): WeaponName[] {
    const options = Array.from(weaponNames);
    
    return buildRandomArray(options, amount, unique);
  }
}

@staticImplements<TestDoubleClass<Protection>>()
class ProtectionDouble {
  private constructor() {
    //
  }

  public static createDouble(): TestDouble<Protection> {
    const [name] = this.pickNames(1);

    return this.createSpecificDouble(name);
  }

  public static createDoublesSet(
    amount: number, unique = true
  ): TestDouble<Protection>[] {
    const names = this.pickNames(amount, unique);
    return names.map(name => this.createSpecificDouble(name));
  }

  public static createSpecificDouble(
    name: ProtectionName
  ): TestDouble<Protection> {
    const hitPoints = randomInteger(5);

    return new (Identified(Protection))(name, hitPoints);
  }

  public static pickNames(amount: number, unique = true): ProtectionName[] {
    const options = Array.from(protectionNames);
    
    return buildRandomArray(options, amount, unique);
  }
}

@staticImplements<TestDoubleClass<AnyMonster>>()
class MonsterDouble {
  private constructor() {
    //
  }

  public static createDouble(): TestDouble<AnyMonster> {
    const [type] = this.pickTypes(1);

    return this.createSpecificDouble(type);
  }

  public static createSpecificDouble(type: MonsterType): TestDouble<AnyMonster> {
    const damage = randomInteger(10);

    return new (Identified(Monster))(type, damage);
  }

  public static createViewDataDouble(): MonsterViewData<MonsterType> {
    return {
      name: this.pickTypes(1)[0],
      damage: randomInteger(5),
      description: randomString(10),
      image: randomString(5)
    };
  }

  public static pickTypes(amount: number, unique = true): MonsterType[] {
    const options = Array.from(monsterTypes);
  
    return buildRandomArray(options, amount, unique);
  }
}

function buildRequestStateDataDummy(): BiddingActionRequestData['state'] {
  return {
    dungeon: MonsterDouble.pickTypes(4),
    hero: HeroDouble.createDouble(),
    remainingMonsters: randomInteger(7),
    remainingPlayers: randomInteger(4)
  };
}

function buildRandomArray<T>(options: T[], length: number, unique = true): T[] {
  if (unique && length > options.length) {
    throw new Error(
      'Array length cannot be larger than available options if items are unique.'
    );
  }

  const chosenItems: T[] = [];

  while(chosenItems.length < length) {
    const randomIndex = randomInteger(options.length, false);
    const chosenItem = unique 
      ? options.splice(randomIndex, 1)[0]
      : options[randomIndex];
    
    chosenItems.push(chosenItem);
  }
  return chosenItems;
}

export { 
  PlayerDouble,
  BiddingPlayersRoundDouble,
  HeroDouble,
  EquipmentDouble,
  ProtectionDouble,
  WeaponDouble, 
  MonsterDouble,
  buildRequestStateDataDummy
}
