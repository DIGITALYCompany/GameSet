export interface CrosshairShape {
  gap: number;
  length: number;
  thickness: number;
  dotSize: number;
  outlineThickness: number;
  outline: boolean;
  dot: boolean;
  tShape: boolean;
  hex: string;
}

const CS_DICTIONARY = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefhijkmnopqrstuvwxyz23456789';

export function hexToRgb(hex: string) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

const fmt = (n: number) => String(Math.round(n * 100) / 100);

export function valorantProfileCode(s: CrosshairShape, colorIndex: number | null): string {
  const parts: (string | number)[] = ['0', 'P'];
  const push = (k: string, v: string | number) => parts.push(k, v);

  if (colorIndex === null) {
    push('c', 8);
    push('u', `${s.hex.slice(1).toUpperCase()}FF`);
  } else {
    push('c', colorIndex);
  }

  push('h', s.outline ? 1 : 0);
  if (s.outline) {
    push('t', s.outlineThickness);
    push('o', 1);
  }

  push('d', s.dot ? 1 : 0);
  if (s.dot) {
    push('z', s.dotSize);
    push('a', 1);
  }
  push('f', 0);

  if (s.length > 0 && s.thickness > 0) {
    push('0t', s.thickness);
    push('0l', s.length);
    push('0o', s.gap);
    push('0a', 1);
    push('0f', 0);
  } else {
    push('0b', 0);
  }
  push('1b', 0);

  return parts.join(';');
}

export function cs2ShareCode(s: CrosshairShape): string {
  const { r, g, b } = hexToRgb(s.hex);
  const gap10 = Math.round(s.gap * 10);
  const len10 = Math.round(s.length * 10);
  const style = 4;
  const bytes = [
    0,
    1,
    gap10 & 0xff,
    Math.round(s.outlineThickness * 2) & 0xff,
    r,
    g,
    b,
    255,
    7,
    30,
    5 | (Number(s.outline) << 3) | (10 << 4),
    5 | (3 << 4),
    Math.round(s.thickness * 10) & 0xff,
    (style << 1) | (Number(s.dot) << 4) | (1 << 6) | (Number(s.tShape) << 7),
    len10 & 0xff,
    (len10 >> 8) & 0x1f,
    0,
    0,
  ];
  bytes[0] = bytes.slice(1).reduce((sum, v) => sum + v, 0) & 0xff;

  let total = bytes.reduce((acc, v) => acc * BigInt(256) + BigInt(v), BigInt(0));
  const base = BigInt(CS_DICTIONARY.length);
  let chars = '';
  for (let i = 0; i < 25; i++) {
    chars += CS_DICTIONARY[Number(total % base)];
    total = total / base;
  }
  return `CSGO-${chars.slice(0, 5)}-${chars.slice(5, 10)}-${chars.slice(10, 15)}-${chars.slice(15, 20)}-${chars.slice(20)}`;
}

export function cs2ConsoleCommands(s: CrosshairShape): string {
  const { r, g, b } = hexToRgb(s.hex);
  return [
    'cl_crosshairstyle 4',
    `cl_crosshairsize ${fmt(s.length)}`,
    `cl_crosshairthickness ${fmt(s.thickness)}`,
    `cl_crosshairgap ${fmt(s.gap)}`,
    `cl_crosshair_drawoutline ${s.outline ? 1 : 0}`,
    `cl_crosshair_outlinethickness ${fmt(s.outlineThickness)}`,
    'cl_crosshaircolor 5',
    `cl_crosshaircolor_r ${r}`,
    `cl_crosshaircolor_g ${g}`,
    `cl_crosshaircolor_b ${b}`,
    `cl_crosshairdot ${s.dot ? 1 : 0}`,
    `cl_crosshair_t ${s.tShape ? 1 : 0}`,
    'cl_crosshairusealpha 1',
    'cl_crosshairalpha 255',
    'cl_crosshairgap_useweaponvalue 0',
  ].join('; ');
}
