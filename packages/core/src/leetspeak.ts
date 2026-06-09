const LEET_MAP: Record<string, string> = {
  '0': 'o', '1': 'i', '2': 'z', '3': 'e', '4': 'a',
  '5': 's', '6': 'g', '7': 't', '8': 'b', '9': 'g',
  '@': 'a', '$': 's', '!': 'i', '|': 'l', '+': 't',
  '(': 'c', ')': 'c', '[': 'c', ']': 'c',
  '{': 'c', '}': 'c', '<': 'c', '>': 'c',
  '/\\': 'a', '\\/': 'v', '|_|': 'u', '|-|': 'h',
  '|\\|': 'n', '|/|': 'm', '|_': 'l',
  '}{': 'h', '[]': 'd', '()': 'o',
};

const MULTI_CHAR_LEET: Array<[string, string]> = [
  ['/\\', 'a'], ['\\/\\/', 'w'], ['\\/','v'],
  ['|_|', 'u'], ['|-|', 'h'], ['|\\|', 'n'],
  ['|/|', 'm'], ['|_', 'l'], ['}{', 'h'],
  ['[]', 'd'], ['()', 'o'], ['><', 'x'],
  ['|)', 'd'], ['|3', 'b'], ['|=', 'f'],
  ['|2', 'r'], ['|-', 'l'],
];

export function deLeetspeak(text: string): string {
  let result = text;

  for (const [leet, normal] of MULTI_CHAR_LEET) {
    while (result.includes(leet)) {
      result = result.replace(leet, normal);
    }
  }

  let output = '';
  for (const char of result) {
    output += LEET_MAP[char] ?? char;
  }
  return output;
}
