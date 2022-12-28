import { AnimatePresence, motion } from "framer-motion";
import { FC } from "react";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import ModalPage from "./components/ModalPage";
import Home from "./page/home/Home.page";
import CreateGame from "./page/home/components/CreateGame";
import JoinGame from "./page/home/components/JoinGame";

export const Wrapper: FC = () => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={{
        initial: {
          opacity: 0,
        },
        in: {
          opacity: 1,
        },
        out: {
          opacity: 0,
        },
      }}
      transition={{
        type: "spring",
        damping: 10,
        stiffness: 50,
      }}
    >
      <Outlet />
    </motion.div>
  );
};

function App() {
  const location = useLocation();
  const background = location.state && location.state.background;

  return (
    <>
      <AnimatePresence exitBeforeEnter>
        <Routes key={"1"} location={background || location}>
          <Route element={<Wrapper />}>
            <Route path="/" element={<Home />}>
              <Route
                path="/create-game"
                element={
                  <ModalPage
                    isPage={true}
                    backPath="/"
                    renderPath="create-game"
                    body={<CreateGame />}
                  />
                }
              />
              <Route
                path="/join-game"
                element={
                  <ModalPage
                    isPage={true}
                    backPath="/"
                    renderPath="join-game"
                    body={<CreateGame />}
                  />
                }
              />
            </Route>
            <Route path="/game/:gameID" element={<>game</>} />
          </Route>
        </Routes>
      </AnimatePresence>
      {background && (
        <Routes key={"2"}>
          <Route
            path="create-game"
            element={
              <ModalPage
                isPage={true}
                backPath="/"
                renderPath="create-game"
                body={<CreateGame />}
              />
            }
          />
          <Route
            path="join-game"
            element={
              <ModalPage
                isPage={true}
                backPath="/"
                renderPath="join-game"
                body={<JoinGame />}
              />
            }
          />
        </Routes>
      )}
    </>
  );
}

export default App;
