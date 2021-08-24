import { 
  Player, PlayerRequirements, BiddingPlayersRound, 
  Hero, HeroType, EquipmentName, equipmentNames, 
  Weapon, WeaponName, weaponNames, Protection, ProtectionName, protectionNames,
  Monster, AnyMonster, MonsterType, monsterTypes
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
}

function buildPlayerRequirementsDummy(): PlayerRequirements {
  const randomAmount = randomInteger(10);
      
  return {
    min: randomAmount + 2,
    max: randomAmount + 5
  };
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

function pickRandomMonsterTypes(amount: number, unique = true): MonsterType[] {
  const options = Array.from(monsterTypes);

  return buildRandomArray(options, amount, unique);
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

export { 
  PlayerDouble, buildPlayerRequirementsDummy,
  BiddingPlayersRoundDouble,
  HeroDouble, ProtectionDouble, WeaponDouble, 
  pickRandomEquipmentNames, pickRandomProtectionNames, pickRandomWeaponNames,
  buildUniqueWeaponDoublesArray,
  MonsterDouble, pickRandomMonsterTypes
}
