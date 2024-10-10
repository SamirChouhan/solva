export const is =
  <TargetType>() =>
  <T extends TargetType>(arg: T): T =>
    arg

export const isNullish = (v: any): v is null | undefined => v === undefined || v === null
