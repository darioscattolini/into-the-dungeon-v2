export abstract class Request<T> {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _resolve: (value: T) => void = () => {};

  // eslint-disable-next-line @typescript-eslint/member-ordering
  private _promise: Promise<T> = new Promise<T>(resolve => {
    this._resolve = resolve;
  });

  public get promise(): Promise<T> {
    return this._promise;
  }

  public onResponse(response: T) {
    this._resolve(response);
  }
}
