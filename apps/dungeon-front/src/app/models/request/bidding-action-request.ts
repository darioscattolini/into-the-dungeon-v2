import { Request } from './request';
import { 
  BiddingStateViewData, MonsterType, MonsterViewData, EquipmentName
} from '../models';
import { AnyEquipmentViewData } from '../equipment/equipment-view-data';

abstract class BiddingActionRequest<T> extends Request<T> {
  public readonly player: string;
  public readonly state: BiddingStateViewData;

  constructor(player: string, state: BiddingStateViewData) {
    super();
    this.player = player;
    this.state = state;
  }
}

export class BidParticipationRequest extends BiddingActionRequest<boolean> {};

export class MonsterAdditionRequest extends BiddingActionRequest<boolean> {
  public readonly monster: MonsterViewData<MonsterType>;

  constructor(
    player: string, 
    state: BiddingStateViewData, 
    monster: MonsterViewData<MonsterType>) {
      super(player, state);
      this.monster = monster;
  }
}

export class EquipmentRemovalRequest 
  extends BiddingActionRequest<EquipmentName> {
    public readonly options: AnyEquipmentViewData[];

    constructor(
      player: string, 
      state: BiddingStateViewData, 
      options: AnyEquipmentViewData[]) {
        super(player, state);
        this.options = options;
    }
  }

  