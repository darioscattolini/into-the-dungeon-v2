import { Protection } from '../protection';

export type ProtectionData = {
  readonly classToBeUsed: typeof Protection;
  readonly hitPoints: number;
}
