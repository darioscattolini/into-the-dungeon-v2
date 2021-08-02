import { 
  Player, PlayerRequirements, AddedPlayers, Hero, EquipmentPack, Monster 
} from './models';
import { 
  TestDouble, TestDoubleClass, Identified, randomInteger
} from '@into-the-dungeon/util-testing';
import { staticImplements } from '@into-the-dungeon/util-common';

jest.mock('./player/player.ts');
jest.mock('./player/added-players.ts');
jest.mock('./hero/hero.ts');
jest.mock('./equipment/equipment-pack.ts');
jest.mock('./monster/monster.ts');

@staticImplements<TestDoubleClass<Player>>()
class PlayerDouble {
  private constructor() {
    //
  }

  public static createDouble(): TestDouble<Player> {
    return new (Identified(Player))();
  }
}

@staticImplements<TestDoubleClass<AddedPlayers>>()
class AddedPlayersDouble {
  private constructor() {
    //
  }

  public static createDouble(): TestDouble<AddedPlayers> {
    return new (Identified(AddedPlayers))();
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
  PlayerDouble, AddedPlayersDouble, buildPlayerRequirementsDummy,
  HeroDouble, EquipmentPackDouble, 
  MonsterDouble 
}
