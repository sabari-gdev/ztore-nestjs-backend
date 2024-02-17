export class APIResponse<T = any> {
  constructor(
    readonly timeStamp?: Date,
    readonly code?: number,
    readonly status?: boolean,
    readonly message?: string,
    readonly data?: T[],
  ) {}

  static create<E = any>(
    req: Partial<Omit<APIResponse<E>, 'timeStamp'>>,
  ): APIResponse<E> {
    return new APIResponse<E>(
      new Date(),
      req.code,
      req.status,
      req.message,
      req.data,
    );
  }
}
