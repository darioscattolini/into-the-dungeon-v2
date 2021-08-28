import { TestBed } from '@angular/core/testing';

import { MonstersService } from './monsters.service';
import { 
  Monster, AnyMonster, monsterTypes, MonsterDataMapIT, monsterDataMap,
  MonsterViewDataMap, MonsterViewDataMapIT, monsterViewDataMap
} from '../../models/models';

describe('MonstersService', () => {
  let monstersService: MonstersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MonstersService,
        { provide: MonsterDataMapIT, useValue: monsterDataMap },
        { provide: MonsterViewDataMapIT, useValue: monsterViewDataMap },
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

  describe.each(monsterTypes)('getViewDataFor(%s))', type => {
    let viewData: MonsterViewDataMap[typeof type];

    beforeEach(() => {
      viewData = monstersService.getViewDataFor(type);
    })

    test('it returns an object of MonsterViewData type', () => {
      expect(viewData)
        .toContainAllKeys(['name', 'damage', 'description', 'image']);
      expect(viewData.name).toBeString();
      expect(viewData.damage).toBeNumber();
      expect(viewData.description).toBeString();
      expect(viewData.image).toBeString();
    });

    test('its name is the same as in monsterViewDataMap', () => {
      expect(viewData.name).toBe(monsterViewDataMap[type].name);
    });

    test('its damage is the same as in monsterViewDataMap', () => {
      expect(viewData.damage).toBe(monsterViewDataMap[type].damage);
    });

    test('its description is the same as in monsterViewDataMap', () => {
      expect(viewData.description).toBe(monsterViewDataMap[type].description);
    });

    test('its image path is the same as in monsterViewDataMap', () => {
      expect(viewData.image).toBe(monsterViewDataMap[type].image);
    });
  });
});
