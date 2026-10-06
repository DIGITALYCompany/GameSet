import { Crosshair, Target, Zap, Flame, Skull, Trophy, Ghost, Bot, Swords, Shield, Rocket, Gamepad2 } from 'lucide-react';

export const AVATARS = {
  crosshair: Crosshair,
  target: Target,
  zap: Zap,
  flame: Flame,
  skull: Skull,
  trophy: Trophy,
  ghost: Ghost,
  bot: Bot,
  swords: Swords,
  shield: Shield,
  rocket: Rocket,
  gamepad: Gamepad2,
} as const;

export type AvatarKey = keyof typeof AVATARS;

