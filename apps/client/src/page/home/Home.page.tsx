import { trpc } from "../../utils/trpc";
import { useState } from "react";
import { Modal } from "../../components/Modal";
import CreateGame from "./components/CreateGame";
import JoinGame from "./components/JoinGame";
import { env } from "@scrumpoker-mf/env";

type Props = {};

const Home = (props: Props) => {
  const [openModal, setOpenModal] = useState({
    openCreateGame: false,
    openJoinGame: false,
  });

  return (
    <div className="flex h-screen items-center justify-center bg-cyan-800">
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Scrumpoker</h1>
            <p className="py-6 text-lg">
              Scrum poker is a fun game that helps teams estimate task size and
              plan work. It's interactive and useful for accurate estimates in
              Agile projects.
            </p>
            <div
              className="btn-primary btn mr-3"
              onClick={() =>
                setOpenModal({ ...openModal, openCreateGame: true })
              }
            >
              Create Game
            </div>

            <div
              className="btn-secondary btn"
              onClick={() => setOpenModal({ ...openModal, openJoinGame: true })}
            >
              Join Game
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={openModal.openCreateGame}
        onClose={() => setOpenModal({ ...openModal, openCreateGame: false })}
      >
        <CreateGame />
      </Modal>
      <Modal
        open={openModal.openJoinGame}
        onClose={() => setOpenModal({ ...openModal, openJoinGame: false })}
      >
        <JoinGame />
      </Modal>
    </div>
  );
};

export default Home;
