import { StateVariable } from "./state-variable";

export type StateUpdate = Partial<{
  [key in StateVariable]: unknown;
}>;
