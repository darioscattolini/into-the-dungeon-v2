import { 
  Player, PlayerRequirements, BiddingPlayersRound, 
  Hero, HeroType, heroTypes, AnyHeroViewData, PlayingHeroViewData,
  EquipmentName, equipmentNames, AnyEquipmentViewData, equipmentViewDataMap,
  Weapon, WeaponName, weaponNames, WeaponEffects,
  Protection, ProtectionName, protectionNames,
  Monster, AnyMonster, MonsterType, monsterTypes, MonsterViewData
} from './models';
import { 
  TestDouble, TestDoubleClass, Identified, randomInteger, randomString
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
      type: this.pickRandomType(),
      image: randomString(5),
      description: randomString(10),
      baseHitPoints: randomInteger(5),
      equipment: buildEquipmentViewDataDummy()
    };
  }

  public static createPlayingHeroViewDataDouble(): PlayingHeroViewData {
    return {
      type: this.pickRandomType(),
      image: randomString(5),
      description: randomString(10),
      hitPoints: randomInteger(5),
      equipment: buildEquipmentViewDataDummy()
    };
  }

  private static pickRandomType(): HeroType {
    const types = heroTypes;
    const randomIndex = randomInteger(heroTypes.length, false);
    
    return types[randomIndex];
  }
}

@staticImplements<TestDoubleClass<Weapon>>()
class WeaponDouble {
  private constructor() {
    //
  }

  public static createDouble(): TestDouble<Weapon> {
    const [name] = pickRandomWeaponNames(1);
    const availableUses = randomInteger(3);

    return new (Identified(Weapon))(name, availableUses, {});
  }
}

@staticImplements<TestDoubleClass<Protection>>()
class ProtectionDouble {
  private constructor() {
    //
  }

  public static createDouble(): TestDouble<Protection> {
    const [name] = pickRandomProtectionNames(1);
    const hitPoints = randomInteger(5);

    return new (Identified(Protection))(name, hitPoints);
  }
}

@staticImplements<TestDoubleClass<AnyMonster>>()
class MonsterDouble {
  private constructor() {
    //
  }

  public static createDouble(): TestDouble<AnyMonster> {
    const [type] = pickRandomMonsterTypes(1);
    const damage = randomInteger(10);

    return new (Identified(Monster))(type, damage);
  }

  public static createViewDataDouble(): MonsterViewData<MonsterType> {
    return {
      name: pickRandomMonsterTypes(1)[0],
      damage: randomInteger(5),
      description: randomString(10),
      image: randomString(5)
    };
  }
}

function buildEquipmentViewDataDummy(): AnyEquipmentViewData[] {
  return pickRandomEquipmentNames(6).reduce((pieces, pieceName) => {
    pieces.push(equipmentViewDataMap[pieceName]);

    return pieces;
  }, [] as AnyEquipmentViewData[]);
}

function buildRandomArray<T>(options: T[], length: number, unique = true): T[] {
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

function buildPlayerRequirementsDummy(): PlayerRequirements {
  const randomAmount = randomInteger(10);
      
  return {
    min: randomAmount + 2,
    max: randomAmount + 5
  };
}

function pickRandomEquipmentNames(
  amount: number, unique = true
): EquipmentName[] {
  const options = Array.from(equipmentNames);
  
  return buildRandomArray(options, amount, unique);
}

function pickRandomWeaponNames(amount: number, unique = true): WeaponName[] {
  const options = Array.from(weaponNames);
  
  return buildRandomArray(options, amount, unique);
}

function pickRandomProtectionNames(
  amount: number, unique = true
): ProtectionName[] {
  const options = Array.from(protectionNames);
  
  return buildRandomArray(options, amount, unique);
}

function buildUniqueWeaponDoublesArray(amount: number): Weapon[] {
  const weapons: Weapon[] = [];
  
  for (let i = 0; i < amount; i++) {
    let newWeapon: Weapon;

    do {
      newWeapon = WeaponDouble.createDouble();
    } while (weapons.find(weapon => weapon.name === newWeapon.name));

    weapons.push(newWeapon);
  }

  return weapons;
}

function buildWeaponEffects(targets: MonsterType[]): WeaponEffects {
  const effects: WeaponEffects = { };

  for (const target of targets) {
    const effect = randomInteger(10);
    effects[target] = (damage: number) => effect * damage;
  }

  return effects;
}

function pickRandomMonsterTypes(amount: number, unique = true): MonsterType[] {
  const options = Array.from(monsterTypes);

  return buildRandomArray(options, amount, unique);
}

const monsterDummyBuilder: { [key in MonsterType]: Monster<key> } = {
  fairy: new Monster('fairy', randomInteger(10)),
  goblin: new Monster('goblin', randomInteger(10)),
  skeleton: new Monster('skeleton', randomInteger(10)),
  orc: new Monster('orc', randomInteger(10)),
  vampire: new Monster('vampire', randomInteger(10)),
  golem: new Monster('golem', randomInteger(10)),
  litch: new Monster('litch', randomInteger(10)),
  demon: new Monster('demon', randomInteger(10)),
  dragon: new Monster('dragon', randomInteger(10))
};

export { 
  PlayerDouble, buildPlayerRequirementsDummy,
  BiddingPlayersRoundDouble,
  HeroDouble, pickRandomEquipmentNames,
  ProtectionDouble, pickRandomProtectionNames,
  WeaponDouble, pickRandomWeaponNames, buildUniqueWeaponDoublesArray, 
  buildWeaponEffects, buildEquipmentViewDataDummy,
  MonsterDouble, pickRandomMonsterTypes, monsterDummyBuilder
}
