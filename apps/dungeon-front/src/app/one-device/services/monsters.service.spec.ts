import { TestBed } from '@angular/core/testing';

import { MonstersService } from './monsters.service';
import { Monster } from '../../models/models';

describe('MonstersService', () => {
  let monstersService: MonstersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MonstersService
      ]
    });
    monstersService = TestBed.inject(MonstersService);
  });

  it('should be created', () => {
    expect(monstersService).toBeTruthy();
  });

  describe('getMonstersPack', () => {
    let monstersPack: Monster[];
    
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

    describe.each([
      ['fairy', 2, 0],
      ['goblin', 2, 1],
      ['skeleton', 2, 2],
      ['orc', 2, 3],
      ['vampire', 2, 4],
      ['golem', 2, 5],
      ['litch', 1, 6],
      ['demon', 1, 7],
      ['dragon', 1, 9],
    ])('%s requirements', (type, maxAmount, damage,) => {
      let instances: Monster[];

      beforeAll(() => {
        instances = monstersPack.filter(monster => monster.type === type);
      });
      
      test(`pack contains ${maxAmount} instances of ${type}`, () => {        
        expect(instances).toHaveLength(maxAmount);
      });

      test(`instances of ${type} have damage amount of ${damage}`, () => {        
        expect(instances)
          .toSatisfyAll((instance: Monster) => instance.damage === damage);
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
