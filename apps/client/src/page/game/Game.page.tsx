import { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import ModalPage from "../../components/ModalPage";
import { useCurrentPlayer, useGame } from "../../store/useGame";
import { trpc } from "../../utils/trpc";
import JoinGame from "../home/components/JoinGame";

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
            </div>
          </div>
        </div>
      </div>
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
