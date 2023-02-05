import React from "react";
import { useCurrentPlayer, useGame } from "../../../store/useGame";
import { trpc } from "../../../utils/trpc";

type Props = {};

const PlayerCards = (props: Props) => {
  const data = useGame();
  const currentPlayer = useCurrentPlayer();
  const { mutateAsync, isLoading } = trpc.game.playerVote.useMutation();
  return (
    <div className="m-auto grid grid-cols-2 gap-10 sm:grid-cols-3 md:grid-cols-4">
      {data.points.map((s, i) => {
        return (
          <button
            key={i}
            onClick={() =>
              mutateAsync({
                gameID: data.id,
                playerId: currentPlayer!.id,
                vote: s,
              })
            }
            className="btn-secondary btn m-2 flex h-24 w-24 cursor-pointer items-center justify-center rounded-xl"
          >
            {isLoading ? (
              <span className="loading btn border-none bg-transparent" />
            ) : (
              <h1 className="text-2xl font-bold ">{s}</h1>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default PlayerCards;
