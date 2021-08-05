import { 
  Player, PlayerRequirements, BiddingPlayersRound, Hero, EquipmentPack, Monster 
} from './models';
import { 
  TestDouble, TestDoubleClass, Identified, randomInteger, randomString
} from '@into-the-dungeon/util-testing';
import { staticImplements } from '@into-the-dungeon/util-common';

jest.mock('./player/player.ts');
jest.mock('./game-mechanics/bidding-players-round.ts');
jest.mock('./hero/hero.ts');
jest.mock('./equipment/equipment-pack.ts');
jest.mock('./monster/monster.ts');

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
    return new (Identified(BiddingPlayersRound))();
  }
}

@staticImplements<TestDoubleClass<Hero>>()
class HeroDouble {
  private constructor() {
    //
  }

  public static createDouble(): TestDouble<Hero> {
    return new (Identified(Hero))();
  }
}

@staticImplements<TestDoubleClass<EquipmentPack>>()
class EquipmentPackDouble {
  private constructor() {
    //
  }

  public static createDouble(): TestDouble<EquipmentPack> {
    return new (Identified(EquipmentPack))();
  }
}

@staticImplements<TestDoubleClass<Monster>>()
class MonsterDouble {
  private constructor() {
    //
  }

  public static createDouble(): TestDouble<Monster> {
    return new (Identified(Monster))();
  }
}

function buildPlayerRequirementsDummy(): PlayerRequirements {
  const randomAmount = randomInteger(10);
      
  return {
    min: randomAmount + 2,
    max: randomAmount + 5
  };
}

export { 
  PlayerDouble, buildPlayerRequirementsDummy,
  BiddingPlayersRoundDouble,
  HeroDouble, EquipmentPackDouble, 
  MonsterDouble 
}
