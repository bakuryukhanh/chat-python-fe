import { useEffect } from "react";
import { useSocketStore } from "./../store/socket";
export const useSubWs = (topic: string, callback: (data: any) => void) => {
  const socket = useSocketStore((state) => state.socket);

  useEffect(() => {
    if (!socket || !socket.connected) return;
    socket.on(topic, callback);
    return () => {
      socket.off(topic, callback);
    };
  }, [callback, socket]);
};
