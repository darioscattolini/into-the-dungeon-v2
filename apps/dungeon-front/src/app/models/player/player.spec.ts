import { randomString } from '@into-the-dungeon/util-testing';

import { Player } from './player';

describe('Player', () => {
  test('it can be created', () => {
    const player = new Player('player');

    expect(player).toBeTruthy();
  });

  test('it is created with provided name', () => {
    const name = randomString(6);
    const player = new Player(name);

    expect(player.name).toBe(name);
  });

  test('it throws error if created with empty name', () => {
    expect(() => { new Player(''); })
      .toThrowError('Player\'s names should have at least one character');
  });
});
