import { Weapon } from '../weapon';
import { AnyMonster } from '../../models';

export class CharmingFlute extends Weapon {
  private defeatedGoblins = 0;

  protected afterEffect(target: AnyMonster): void {
    if (target.type === 'goblin') {
      this.defeatedGoblins++;
      this.addEffects({
        skeleton: damage => -Math.max(0, damage - this.defeatedGoblins),
        orc: damage => -Math.max(0, damage - this.defeatedGoblins),
        vampire: damage => -Math.max(0, damage - this.defeatedGoblins),
        golem: damage => -Math.max(0, damage - this.defeatedGoblins),
        litch: damage => -Math.max(0, damage - this.defeatedGoblins),
        demon: damage => -Math.max(0, damage - this.defeatedGoblins),
        dragon: damage => -Math.max(0, damage - this.defeatedGoblins)
      });
    }
  }
}
