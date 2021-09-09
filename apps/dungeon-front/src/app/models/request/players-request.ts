import { Request } from './request';

type PlayersNames = string[];

interface PlayersRequestContent {
  range: [number, number];
};

export type PlayersRequest = Request<PlayersNames, PlayersRequestContent>;
