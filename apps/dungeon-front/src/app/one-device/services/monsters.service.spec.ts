import { TestBed } from '@angular/core/testing';

import { MonstersService } from './monsters.service';
import { 
  Monster, AnyMonster, monsterTypes, MonsterDataMapIT, monsterDataMap 
} from '../../models/models';

describe('MonstersService', () => {
  let monstersService: MonstersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MonstersService,
        { provide: MonsterDataMapIT, useValue: monsterDataMap },
      ]
    });
    monstersService = TestBed.inject(MonstersService);
  });

  it('should be created', () => {
    expect(monstersService).toBeTruthy();
  });

  describe('getMonstersPack', () => {
    let monstersPack: AnyMonster[];
    
    beforeEach(() => {
      monstersPack = monstersService.getMonstersPack();
    });

    test('it returns an array', () => {
      expect(monstersService.getMonstersPack()).toBeArray();
    });

    test('it returns 15 members', () => {
      expect(monstersPack).toHaveLength(15);
    });

    test('it contains Monsters', () => {
      expect(monstersPack).toSatisfyAll(monster => monster instanceof Monster);
    });

    describe.each(monsterTypes)('%s requirements', type => {
      let instances: AnyMonster[];

      beforeAll(() => {
        instances = monstersPack.filter(monster => monster.type === type);
      });
      
      test('amount of instances is as specified in monsterDataMap', () => {        
        expect(instances).toHaveLength(monsterDataMap[type].maxAmount);
      });

      test('instances have damage amount specified in monsterDataMap', () => {
        const expectedDamage = monsterDataMap[type].damage;

        expect(instances).toSatisfyAll(
          (instance: AnyMonster) => instance.damage === expectedDamage
        );
      });
    });

    test('it is randomly ordered', () => {
      const packs: string[][] = [];
      for (let i = 0; i < 100; i++) {
        const currentPack = 
          monstersService.getMonstersPack().map(monster => monster.type);
        packs.push(currentPack);
      }

      const variations: number[] = [];
      for (let position = 0; position < packs[0].length; position++) {
        const unrepeatedTypes: string[] = [];
        for (let pack = 0; pack < packs.length; pack++) {
          if (!unrepeatedTypes.includes(packs[pack][position])) {
            unrepeatedTypes.push(packs[pack][position]);
          }
        }
        variations.push(unrepeatedTypes.length);
      }
      
      expect(variations).toSatisfyAll(number => number >= 8);
    });
  });
});
