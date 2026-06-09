export type Result<Value, Failure extends Error = Error> =
  | { readonly ok: true; readonly value: Value }
  | { readonly ok: false; readonly error: Failure };

export function ok<Value>(value: Value): Result<Value, never> {
  return { ok: true, value };
}

export function fail<Failure extends Error>(error: Failure): Result<never, Failure> {
  return { ok: false, error };
}
