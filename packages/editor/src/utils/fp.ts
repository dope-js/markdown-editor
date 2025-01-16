/**
 * Calls callback with the first argument, and returns it.
 * @group Utils
 */
export function tap<T>(arg: T, proc: (arg: T) => unknown): T {
  proc(arg);
  return arg;
}
