import React from "react";
import { trpc } from "./utils/trpc";

function App() {
  const { data } = trpc.game.createGame.useQuery();
  return (
    <div className="bg-green-200 h-screen text-white">
      <div className="">hello--mf</div>
      <div className="">hello--{data?.game}</div>
    </div>
  );
}

export default App;
