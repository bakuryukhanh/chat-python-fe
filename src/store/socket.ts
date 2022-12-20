import { Socket } from "socket.io-client";
import create from "zustand";

export const useSocketStore = create<{
  socket: Socket | null;
  setSocket: (socket: Socket) => void;
}>((set) => ({
  socket: null,
  setSocket: (socket: Socket) => set({ socket }),
}));
