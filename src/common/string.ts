export function isDigit(curr: string) {
  return curr.length === 1 && "0" <= curr && curr <= "9";
}

export function isLetter(curr: string) {
  return (
    curr.length === 1 &&
    (("a" <= curr && curr <= "z") || ("A" <= curr && curr <= "Z"))
  );
}