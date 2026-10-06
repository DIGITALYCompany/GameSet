import type { GameId } from "@/types";
export const GAME_ASSETS: Record<GameId, { icon: string; artwork: string }> = {
  valorant: {
    icon: "/games/valorant-mark.svg",
    artwork: "/games/valorant-art.jpg",
  },
  cs2: { icon: "/games/counterstrike-mark.svg", artwork: "/games/cs2-art.jpg" },
  apex: { icon: "/games/apex-mark.svg", artwork: "/games/apex-art.jpg" },
  cod: { icon: "/games/cod-mark.ico", artwork: "/games/cod-art.jpg" },
  r6: { icon: "/games/r6-mark.svg", artwork: "/games/r6-art.jpg" },
  overwatch2: {
    icon: "/games/overwatch-mark.svg",
    artwork: "/games/overwatch2-art.jpg",
  },
  fortnite: {
    icon: "/games/fortnite-mark.png",
    artwork: "/games/fortnite-art.jpg",
  },
  thefinals: {
    icon: "/games/thefinals-mark.svg",
    artwork: "/games/thefinals-art.jpg",
  },
};
