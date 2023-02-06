import { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import GameIDContainer from "../../components/GameIDContainer";
import ModalPage from "../../components/ModalPage";
import {
  GameState,
  useCurrentPlayer,
  useGame,
  useGameActions,
} from "../../store/useGame";
import { PusherProvider, useSubscribeToEvent } from "../../utils/pusher";
import { trpc } from "../../utils/trpc";
import JoinGame from "../home/components/JoinGame";
import PlayerCards from "./components/PlayerCards";
import PlayerListView from "./components/PlayerListView";
import StartGameButton from "./components/StartGameButton";

const GameView = () => {
  const data = useGame();
  const currentPlayer = useCurrentPlayer();
  const { updateGame } = useGameActions();
  const { mutateAsync, isLoading } = trpc.game.revealAllVotes.useMutation();
  const { mutateAsync: Offline } = trpc.game.playerOffline.useMutation();
  useSubscribeToEvent(
    "update-game",
    (data: { game: GameState }) => {
      updateGame(data.game);
    },
    "public"
  );
  useSubscribeToEvent(
    "pusher:member_removed",
    (payload: { id: string }) => {
      Offline({
        gameID: data.id,
        playerId: payload.id,
      })
        .then((s) => null)
        .catch();
    },
    "presence"
  );
  return (
    <div className="m-4">
      <div className="mockup-window border bg-base-300 py-8">
        <div className="min-h-16 flex flex-col">
          <div className="relative mb-10 flex items-center justify-center">
            <div className="absolute top-0 left-0 mx-3 flex h-fit w-fit flex-row rounded-lg bg-primary p-3">
              <div className="mr-3 font-bold">Name:</div>
              <div className="font-semibold">
                {currentPlayer?.nickname ?? "Who ?"}
              </div>
            </div>
            {data.is_open && <GameIDContainer id={data.id} />}
          </div>
          <PlayerCards />
          {currentPlayer?.is_party_leader && <StartGameButton />}
          {currentPlayer?.is_party_leader && (
            <div className="mx-5 flex justify-end">
              <button
                className={`${isLoading ? "loading" : ""}btn-primary btn`}
                onClick={() =>
                  mutateAsync({
                    gameID: data.id,
                    playerId: currentPlayer.id,
                  })
                }
              >
                {data.revealVote ? "Hide" : "Show"}
              </button>
            </div>
          )}
          <PlayerListView />
        </div>
      </div>
    </div>
  );
};
const Game = () => {
  const pathname = useLocation();
  const gameID = useMemo(() => pathname.pathname.split("/")[2], [pathname]);
  const data = useGame();
  const currentPlayer = useCurrentPlayer();
  const [openUserModal, setOpenUserModal] = useState(false);

  const { data: checkGame, isLoading: loadingCheckGame } =
    trpc.game.checkGame.useQuery(
      {
        gameId: gameID as string,
      },
      {
        enabled: !!gameID,
      }
    );

  useEffect(() => {
    if (data.id === "" || !currentPlayer) {
      setOpenUserModal(true);
    }
  }, [data, currentPlayer]);
  if (loadingCheckGame) {
    return <div className="loading"></div>;
  }

  if (!checkGame) {
    return <Navigate to="/" replace />;
  }

  if (checkGame && checkGame.is_over) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      {currentPlayer ? (
        <PusherProvider
          gameId={data.id}
          player={currentPlayer?.id}
          nickname={currentPlayer?.nickname}
        >
          <GameView />
        </PusherProvider>
      ) : null}

      <ModalPage
        backPath=""
        body={<JoinGame gameID={gameID} closeModal={setOpenUserModal} />}
        isPage={false}
        renderPath=""
        onClose={setOpenUserModal}
        show={openUserModal}
      />
    </>
  );
};

export default Game;
