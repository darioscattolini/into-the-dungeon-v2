import { 
  Player, PlayerRequirements, BiddingPlayersRound, 
  Hero, Equipment, EquipmentName, equipmentNames, WeaponName, weaponNames,
  Monster, MonsterType, monsterTypes
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
    const hitPoints = randomInteger(5);

    return new (Identified(Hero))(hitPoints);
  }
}

@staticImplements<TestDoubleClass<Monster>>()
class MonsterDouble {
  private constructor() {
    //
  }

  public static createDouble(): TestDouble<Monster> {
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

function buildEquipmentPackDouble(amount: number): Equipment[] {
  const pack: Equipment[] = [];
  const names = pickRandomEquipmentNames(amount);

  for (const name of names) pack.push(new Equipment(name));

  return pack;
}

function pickRandomMonsterTypes(amount: number, unique = true): MonsterType[] {
  const options = Array.from(monsterTypes);

  return buildRandomArray(options, amount, unique);
}

function pickRandomEquipmentNames(amount: number, unique = true): EquipmentName[] {
  const options = Array.from(equipmentNames);
  
  return buildRandomArray(options, amount, unique);
}

function pickRandomWeaponNames(amount: number, unique = true): WeaponName[] {
  const options = Array.from(weaponNames);
  
  return buildRandomArray(options, amount, unique);
}

export { 
  PlayerDouble, buildPlayerRequirementsDummy,
  BiddingPlayersRoundDouble,
  HeroDouble, pickRandomEquipmentNames, pickRandomWeaponNames, 
  buildEquipmentPackDouble,
  MonsterDouble, pickRandomMonsterTypes
}
