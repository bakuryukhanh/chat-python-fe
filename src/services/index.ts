import axios from "axios";

const API_URL = "http://localhost:8080";

const request = axios.create({
  baseURL: API_URL,
});

export const setUpRequest = (token: string) => {
  request.defaults.headers.common["authorization"] = `Bearer ${token}`;
};

request.defaults.headers.common[
  "authorization"
] = `Bearer ${localStorage.getItem("token")}`;

export const requestLogin = (body: { email: string; password: string }) => {
  return request.post("/user/login", body);
};

export const requestRegister = (body: {
  email: string;
  password: string;
  name: string;
}) => {
  return request.post("/user/register", body);
};

export const requestRooms = () => {
  return request.get("/rooms");
};

export const requestMessages = (roomId: string) => {
  return request.get(`/messages/${roomId}`);
};

export const requestMe = () => {
  return request.get("/user/me");
};

export const requestRoomInfo = (roomId: string) => {
  return request.get(`/rooms/info/${roomId}`);
};

export const requestSendMessage = (
  roomId: string,
  body: {
    content: string;
    attachment?: File;
    type: "text" | "image";
  }
) => {
  const form = new FormData();
  form.append("content", body.content);
  form.append("type", body.type);
  if (body.attachment) {
    form.append("attachment", body.attachment);
  }
  return request.post(`/messages/send/${roomId}`, form);
};

export const requestJoinRoom = (roomId: string) => {
  return request.post(`/rooms/join/${roomId}`);
};

export const requestCreateRoom = (body: { name: string }) => {
  return request.post("/rooms/", body);
};
