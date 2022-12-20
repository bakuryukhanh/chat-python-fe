import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { requestMe, setUpRequest } from "../services";
import { useSocketStore } from "../store/socket";
import { useUserStore } from "../store/user";

const unAuthRoutes = ["/login", "/register"];

const RouterLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  useEffect(() => {
    if (!user && !unAuthRoutes.includes(location.pathname)) {
      navigate("/login");
    }
    if (location.pathname === "/" && user) {
      navigate("/chat");
    }
    if (location.pathname === "/" && !user) {
      navigate("/login");
    }
  }, [location.pathname, navigate, user]);
  return <>{children}</>;
};

const BasicLayout = () => {
  const setSocket = useSocketStore((state) => state.setSocket);
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();

  const { isFetched } = useQuery(
    ["user"],
    async () => {
      const res = await requestMe();
      if (res.status === 200) {
        return res.data;
      }
      throw new Error("Unauthorized");
    },
    {
      onSuccess: (data) => {
        setUser(data);
      },
      onError: () => {
        navigate("/login");
      },
    }
  );

  //set up socket
  useEffect(() => {
    const socket = io("localhost:8080", {
      transports: ["websocket"],
      path: "/ws",
    });
    socket.connect();
    socket.on("connect", () => {
      socket.emit("authorization", {
        token: localStorage.getItem("token"),
      });
      setSocket(socket);
    });
    return () => {
      socket.disconnect();
    };
  }, [setSocket]);

  // set up headers for request
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUpRequest(token);
    }
  });

  if (!isFetched) return null;

  return (
    <RouterLayout>
      <Outlet />
    </RouterLayout>
  );
};

export default BasicLayout;
