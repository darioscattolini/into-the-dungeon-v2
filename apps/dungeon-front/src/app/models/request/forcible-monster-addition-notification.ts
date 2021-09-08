import { Notification } from './notification';
import { MonsterViewData, MonsterType } from '../models';

export type ForcibleMonsterAdditionNotification = 
  Notification<MonsterViewData<MonsterType>>;
