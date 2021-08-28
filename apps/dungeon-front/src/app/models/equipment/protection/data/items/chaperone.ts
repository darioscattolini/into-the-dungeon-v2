import { ProtectionData } from '../protection-data';
import { Protection } from '../../protection';

export const chaperone: ProtectionData = {
  classToBeUsed: Protection,
  hitPoints: 3
} as const;
