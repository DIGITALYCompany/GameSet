import type { Tool } from '@/types';

/**
 * Tool registry — the single source of truth for all GAMESET tools.
 * Add new tools here; ToolCard and the Tools page render from this list.
 */
export const TOOLS: Tool[] = [
  {
    id: 'sensitivity-finder',
    name: 'Sensitivity Finder',
    slug: 'sensitivity-finder',
    description:
      'Find your perfect sensitivity through a progressive comparison process.',
    icon: 'Crosshair',
    category: 'sensitivity',
    status: 'available',
    route: '/sensitivity',
  },
  {
    id: 'aim-trainer',
    name: 'Aim Trainer',
    slug: 'aim-trainer',
    description: 'Sharpen your flicking and tracking with targeted drills.',
    icon: 'Target',
    category: 'aim',
    status: 'coming_soon',
    route: '/tools/aim-trainer',
  },
  {
    id: 'sensitivity-converter',
    name: 'Sensitivity Converter',
    slug: 'sensitivity-converter',
    description: 'Convert your sensitivity between different FPS games.',
    icon: 'Repeat',
    category: 'conversion',
    status: 'available',
    route: '/tools/sensitivity-converter',
  },
  {
    id: 'edpi-calculator',
    name: 'eDPI Calculator',
    slug: 'edpi-calculator',
    description: 'Calculate your effective DPI for any game setup.',
    icon: 'Calculator',
    category: 'conversion',
    status: 'available',
    route: '/tools/edpi-calculator',
  },
  {
    id: 'cm360-calculator',
    name: 'cm/360 Calculator',
    slug: 'cm360-calculator',
    description: 'Measure your centimeters per 360-degree turn.',
    icon: 'Ruler',
    category: 'conversion',
    status: 'available',
    route: '/tools/cm360-calculator',
  },
  {
    id: 'fps-benchmark',
    name: 'FPS Benchmark',
    slug: 'fps-benchmark',
    description: 'Benchmark your system performance in real time.',
    icon: 'Gauge',
    category: 'performance',
    status: 'coming_soon',
    route: '/tools/fps-benchmark',
  },
  {
    id: 'input-latency-test',
    name: 'Input Latency Test',
    slug: 'input-latency-test',
    description: 'Measure your mouse-to-display input latency.',
    icon: 'Timer',
    category: 'performance',
    status: 'coming_soon',
    route: '/tools/input-latency-test',
  },
  {
    id: 'crosshair-generator',
    name: 'Crosshair Generator',
    slug: 'crosshair-generator',
    description: 'Design and export custom crosshairs for any game.',
    icon: 'Plus',
    category: 'aim',
    status: 'available',
    route: '/tools/crosshair-generator',
  },
  {
    id: 'player-profile',
    name: 'Player Profile',
    slug: 'player-profile',
    description: 'Build your gaming profile and share your settings.',
    icon: 'User',
    category: 'profile',
    status: 'available',
    route: '/account',
  },
  {
    id: 'statistics',
    name: 'Statistics',
    slug: 'statistics',
    description: 'Track your performance trends over time.',
    icon: 'BarChart3',
    category: 'profile',
    status: 'coming_soon',
    route: '/tools/statistics',
  },
];

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getAvailableTools(): Tool[] {
  return TOOLS.filter((t) => t.status === 'available');
}

export function getComingSoonTools(): Tool[] {
  return TOOLS.filter((t) => t.status === 'coming_soon');
}
