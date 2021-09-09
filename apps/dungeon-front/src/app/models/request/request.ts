export interface Request<Response, Content> {
  readonly content: Readonly<Content>;
  readonly resolve: (value: Response) => void;
}

export interface HasTarget {
  player: string;
}

export type TargetedRequest<Response, Content extends HasTarget> 
  = Request<Response, Content>;
