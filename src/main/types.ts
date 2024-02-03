export type CommonRes<T> =
  | {
      code: 0;
      success: true;
      res: T;
    }
  | {
      code: 1;
      success: false;
      message: string;
    };
