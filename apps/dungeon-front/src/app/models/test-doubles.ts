import { AddedPlayers, Player, Hero, EquipmentPack, Monster } from './models';
import { Stub, StubClass, Identified } from '@into-the-dungeon/util-testing';
import { staticImplements } from '@into-the-dungeon/util-common';

jest.mock('./player/player.ts');
jest.mock('./player/added-players.ts');
jest.mock('./hero/hero.ts');
jest.mock('./equipment/equipment-pack.ts');
jest.mock('./monster/monster.ts');

@staticImplements<StubClass<Player>>()
class PlayerStub {
  private constructor() {
    //
  }

  public static createStub(): Stub<Player> {
    return new (Identified(Player))();
  }
}

@staticImplements<StubClass<AddedPlayers>>()
class AddedPlayersStub {
  private constructor() {
    //
  }

  public static createStub(): Stub<AddedPlayers> {
    return new (Identified(AddedPlayers))();
  }
}

@staticImplements<StubClass<Hero>>()
class HeroStub {
  private constructor() {
    //
  }

  public static createStub(): Stub<Hero> {
    return new (Identified(Hero))();
  }
}

@staticImplements<StubClass<EquipmentPack<Hero>>>()
class EquipmentPackStub {
  private constructor() {
    //
  }

  public static createStub(): Stub<EquipmentPack<Hero>> {
    return new (Identified(EquipmentPack))();
  }
}

@staticImplements<StubClass<Monster>>()
class MonsterStub {
  private constructor() {
    //
  }

  public static createStub(): Stub<Monster> {
    return new (Identified(Monster))();
  }
}

export { 
  PlayerStub, AddedPlayersStub, 
  HeroStub, EquipmentPackStub, 
  MonsterStub 
}
