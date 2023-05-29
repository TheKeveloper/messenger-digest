export function trimToUndefined(
  value: string | undefined | null
): string | undefined {
  if (value == null) {
    return undefined;
  }

  if (value.trim() === "") {
    return undefined;
  }

  return value;
}
