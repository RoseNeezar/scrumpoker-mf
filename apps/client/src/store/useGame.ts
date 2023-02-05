import { GameType, PlayerType } from "@scrumpoker-mf/api";
import create from "zustand";
import { persist } from "zustand/middleware";
import { combine } from "zustand/middleware";

export type IPlayer = PlayerType;

export type GameState = GameType;

export type TimerState = {
  countDown: string;
  msg: string;
};
export interface IState {
  Game: GameState;
  currentPlayer?: IPlayer;
}

export const useGameStore = create(
  persist(
    combine(
      {
        Game: {
          id: "",
          is_open: false,
          is_over: false,
          players: [],
          points: [],
          revealVote: false,
        },
        currentPlayer: undefined,
      } as IState,
      (set) => ({
        action: {
          updateGame: (data: GameState) =>
            set((state) => ({
              Game: {
                ...state.Game,
                ...data,
              },
            })),
          updateCurrentPlayer: (data: IPlayer) =>
            set(() => ({
              currentPlayer: data,
            })),
        },
      })
    ),
    {
      name: "game",
      getStorage: () => sessionStorage,
    }
  )
);

export const useGame = () => useGameStore((state) => state.Game);
export const useCurrentPlayer = () =>
  useGameStore((state) => state.currentPlayer);
export const useGameActions = () => useGameStore((state) => state.action);
