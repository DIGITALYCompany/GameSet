import type { GameId } from "@/types";
export const PROSETTINGS_LINKS: Partial<Record<GameId, string>> = {
  valorant: "https://prosettings.net/games/valorant/",
  cs2: "https://prosettings.net/games/cs2/",
  apex: "https://prosettings.net/games/apex-legends/",
  cod: "https://prosettings.net/games/call-of-duty-warzone/",
  r6: "https://prosettings.net/games/rainbow-six/",
  overwatch2: "https://prosettings.net/games/overwatch/",
  fortnite: "https://prosettings.net/games/fortnite/",
};
export const PLAYER_REFERENCES: Partial<
  Record<GameId, { name: string; url: string }[]>
> = {
  valorant: [
    { name: "TenZ", url: "https://prosettings.net/players/tenz/" },
    { name: "aspas", url: "https://prosettings.net/players/aspas/" },
    { name: "Demon1", url: "https://prosettings.net/players/demon1/" },
  ],
  cs2: [
    { name: "s1mple", url: "https://prosettings.net/players/s1mple/" },
    { name: "ZywOo", url: "https://prosettings.net/players/zywoo/" },
    { name: "NiKo", url: "https://prosettings.net/players/niko/" },
  ],
};
