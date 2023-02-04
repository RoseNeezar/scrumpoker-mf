import React from "react";
import { useGame } from "../../../store/useGame";

type Props = {};

const PlayerCards = (props: Props) => {
  const data = useGame();

  return (
    <div className="m-auto grid grid-cols-2 gap-10 sm:grid-cols-3 md:grid-cols-4">
      {data.points.map((s, i) => {
        return (
          <div
            key={i}
            className="m-2 flex h-24 w-24 cursor-pointer items-center justify-center rounded-xl bg-secondary hover:bg-pink-700"
          >
            <h1 className="text-2xl font-bold ">{s}</h1>
          </div>
        );
      })}
    </div>
  );
};

export default PlayerCards;
