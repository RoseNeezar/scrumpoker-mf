import { Game, Player } from "@prisma/client";
import * as trpc from "@trpc/server";
import { z } from "zod";
import { pusherServerClient } from "../common/pusher";
import { publicProcedure, router } from "../trpc";

export const gameRouter = router({
  createGame: publicProcedure
    .input(z.object({ nickname: z.string() }))
    .mutation(async ({ ctx, input }) => {
      let game = await ctx.prisma.game.create({
        data: {
          points: {
            set: [0, 1, 2, 3, 5, 8, 13, 20, 40],
          },
        },
        include: {
          players: true,
        },
      });

      let player = await ctx.prisma.player.findFirst({
        where: {
          nickname: input.nickname,
        },
      });

      if (!player) {
        player = await ctx.prisma.player.create({
          data: {
            is_party_leader: true,
            nickname: input.nickname,
            game_id: game.id,
            online: true,
          },
        });
      } else {
        player = await ctx.prisma.player.update({
          where: {
            id: player.id,
          },
          data: {
            vote: 0,
            is_party_leader: true,
            game: {
              connect: {
                id: game.id,
              },
            },
          },
        });
      }

      game = (await ctx.prisma.game.findFirst({
        where: {
          id: game.id,
        },
        include: {
          players: true,
        },
      })) as Game & { players: Player[] };

      return {
        game: game as Game & { players: Player[] },
        currentPlayer: player,
      };
    }),
  checkGame: publicProcedure
    .input(z.object({ gameId: z.string() }))
    .query(async ({ input, ctx }) => {
      const check = await ctx.prisma.game.findFirst({
        where: {
          id: input.gameId,
        },
        include: {
          players: true,
        },
      });

      return check;
    }),
  joinGame: publicProcedure
    .input(z.object({ nickname: z.string(), gameID: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const game = (await ctx.prisma.game.findFirst({
        where: {
          id: input.gameID,
        },
        include: {
          players: true,
        },
      })) as Game & {
        players: Player[];
      };

      if (!game) {
        throw new trpc.TRPCError({
          code: "NOT_FOUND",
          message: "Game not found",
        });
      }

      const otherPlayerInGame = await ctx.prisma.player.findFirst({
        where: {
          nickname: input.nickname,
          game_id: game.id,
          online: true,
          game: {
            is_over: false,
            is_open: true,
          },
        },
      });

      if (otherPlayerInGame) {
        throw new trpc.TRPCError({
          code: "CONFLICT",
          message: "Player name in used in game, use another",
        });
      }

      let player = await ctx.prisma.player.findFirst({
        where: {
          nickname: input.nickname,
        },
      });

      if (player) {
        player = await ctx.prisma.player.update({
          where: {
            nickname: input.nickname,
          },
          data: {
            game_id: game.id,
            online: true,
          },
        });
      } else {
        player = await ctx.prisma.player.create({
          data: {
            vote: 0,
            is_party_leader: false,
            nickname: input.nickname,
            game_id: game.id,
            online: true,
          },
        });
      }
      const check = game.players.findIndex(
        (s) => s.nickname === player!.nickname
      );

      if (check === -1) {
        game.players.push(player);
      }

      try {
        await pusherServerClient.trigger(
          `game-${input.gameID}`,
          "update-game",
          {
            game,
          }
        );
      } catch (error) {
        console.log("pusher server error--", error);
      }

      return {
        game,
        currentPlayer: player,
      };
    }),
  playerVote: publicProcedure
    .input(
      z.object({ playerId: z.string(), gameID: z.string(), vote: z.number() })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.player.update({
        where: {
          id: input.playerId,
        },
        data: {
          vote: input.vote,
        },
      });

      const game = await ctx.prisma.game.findFirst({
        where: {
          id: input.gameID,
        },
        include: {
          players: true,
        },
      });

      try {
        await pusherServerClient.trigger(
          `game-${input.gameID}`,
          "update-game",
          {
            game,
          }
        );
      } catch (error) {
        console.log("pusher server error--", error);
      }
      return null;
    }),
  revealAllVotes: publicProcedure
    .input(z.object({ playerId: z.string(), gameID: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const player = await ctx.prisma.player.findFirst({
        where: {
          id: input.playerId,
        },
      });

      const game = await ctx.prisma.game.findFirst({
        where: {
          id: input.gameID,
        },
        include: {
          players: true,
        },
      });

      if (player && player.is_party_leader && game) {
        const update = await ctx.prisma.game.update({
          data: {
            revealVote: !game.revealVote,
          },
          where: {
            id: input.gameID,
          },
          include: {
            players: true,
          },
        });

        try {
          await pusherServerClient.trigger(
            `game-${input.gameID}`,
            "update-game",
            {
              game: update,
            }
          );
        } catch (error) {
          console.log("pusher server error--", error);
        }
      }
      return null;
    }),
  playerOffline: publicProcedure
    .input(z.object({ playerId: z.string(), gameID: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.player.update({
        where: {
          id: input.playerId,
        },
        data: {
          online: false,
        },
      });
      return null;
    }),
  newRound: publicProcedure
    .input(z.object({ playerId: z.string(), gameID: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.player.updateMany({
        where: {
          game_id: input.gameID,
        },
        data: {
          vote: 0,
        },
      });
      const game = await ctx.prisma.game.update({
        where: {
          id: input.gameID,
        },
        data: {
          revealVote: false,
        },
        include: {
          players: true,
        },
      });
      try {
        await pusherServerClient.trigger(
          `game-${input.gameID}`,
          "update-game",
          {
            game,
          }
        );
      } catch (error) {
        console.log("pusher server error--", error);
      }
      return null;
    }),
});
