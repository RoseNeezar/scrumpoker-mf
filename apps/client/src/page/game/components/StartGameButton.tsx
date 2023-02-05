import React from "react";
import { useCurrentPlayer, useGame } from "../../../store/useGame";
import { trpc } from "../../../utils/trpc";

type Props = {};

const StartGameButton = (props: Props) => {
  const data = useGame();
  const currentPlayer = useCurrentPlayer();
  const { mutateAsync, isLoading } = trpc.game.newRound.useMutation();
  return (
    <button
      className={`${
        isLoading ? "loading" : ""
      } btn-primary btn m-auto my-10 w-fit`}
      onClick={() =>
        mutateAsync({
          gameID: data.id,
          playerId: currentPlayer!.id,
        })
      }
    >
      New round
    </button>
  );
};

export default StartGameButton;
