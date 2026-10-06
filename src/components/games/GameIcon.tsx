import { GAME_ASSETS } from "@/data/gameAssets";
import { GAMES } from "@/data/games";
import type { GameId } from "@/types";
import { cn } from "@/utils/cn";
import { Crosshair } from "lucide-react";

const dimensions = {
  xs: { box: "h-5 w-5 rounded", image: "h-4 w-4" },
  sm: { box: "h-8 w-8 rounded-lg", image: "h-6 w-6" },
  md: { box: "h-10 w-10 rounded-lg", image: "h-7 w-7" },
  lg: { box: "h-16 w-16 rounded-xl", image: "h-10 w-10" },
};
export function GameIcon({
  gameId,
  gameName,
  size = "md",
  className,
}: {
  gameId?: GameId;
  gameName?: string;
  size?: keyof typeof dimensions;
  className?: string;
}) {
  const id = gameId || GAMES.find((game) => game.name === gameName)?.id;
  const image = id && GAME_ASSETS[id]?.icon;
  const dimension = dimensions[size];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden border border-white/15 bg-[#10111b] shadow-sm align-middle",
        dimension.box,
        className,
      )}
      aria-hidden="true"
    >
      {image ? (
        <img
          src={image}
          alt=""
          width={32}
          height={32}
          className={cn(
            "h-full w-full object-contain",
            id && ["cod", "fortnite"].includes(id) ? "object-cover" : id && ["apex", "thefinals"].includes(id) ? "p-[8%]" : "p-[15%]",
            id && ["valorant", "cs2", "apex", "overwatch2", "thefinals"].includes(id) && "brightness-0 invert",
          )}
        />
      ) : (
        <Crosshair className={cn(dimension.image, "text-ink-muted")} />
      )}
    </span>
  );
}
