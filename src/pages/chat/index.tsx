import { useQuery } from "@tanstack/react-query";
import { Form } from "antd";
import { useEffect, useMemo, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { Modal } from "../../components/Modal";
import { useSubWs } from "../../hooks";
import {
  requestCreateRoom,
  requestJoinRoom,
  requestMessages,
  requestRooms,
} from "../../services";
import { useSocketStore } from "../../store/socket";
import Message from "./message";
import Room from "./room";

const Chat = () => {
  const [joinOpen, setJoinOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();
  const { data: rooms } = useQuery(["rooms"], async () => {
    const res = await requestRooms();
    if (res.status === 200) {
      return res.data;
    }
  });
  const { roomId } = useParams();

  const handleJoinRoom = async (values: { room_id: string }) => {
    console.log("run");
    const res = await requestJoinRoom(values.room_id);
    if (res.status === 200) {
      setJoinOpen(false);
    }
  };

  const handleCreateRoom = async (values: { room_name: string }) => {
    console.log("run");
    const res = await requestCreateRoom({
      name: values.room_name,
    });
    if (res.status === 200) {
      setCreateOpen(false);
    }
  };

  return (
    <div className="grid grid-cols-12 bg-gray-700 h-full overflow-hidden">
      {/* Put this part before </body> tag */}
      <Modal open={joinOpen} onClickOutside={() => setJoinOpen(false)}>
        <Form form={form} onFinish={(values) => handleJoinRoom(values)}>
          <label
            htmlFor="room_id"
            className="w-full font-bold text-center flex text-xl justify-center
            mb-3 text-gray-200"
          >
            Enter room id:
          </label>
          <Form.Item noStyle name="room_id">
            <input
              id="room_id"
              className="border-[1px] border-gray-600 rounded-xl py-2 px-2 text-center"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  form.submit();
                }
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal open={createOpen} onClickOutside={() => setCreateOpen(false)}>
        <Form form={createForm} onFinish={(values) => handleCreateRoom(values)}>
          <label
            htmlFor="room_name"
            className="w-full font-bold text-center flex text-xl justify-center
            mb-3 text-gray-200"
          >
            Enter room name:
          </label>
          <Form.Item noStyle name="room_name">
            <input
              id="room_id"
              className="border-[1px] border-gray-600 rounded-xl py-2 px-2 text-center"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  createForm.submit();
                }
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
      <div className="col-span-3  h-screen bg-gray-800 relative">
        <div className=" h-screen">
          <div className="w-full h-full px-3 py-5">
            <div className="flex justify-between pb-3 ">
              <h1 className="text-2xl font-bold text-gray-300 ">Chats</h1>
              <label
                className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white px-[1px] py-[1px]  rounded-lg font-bold cursor-pointer"
                onClick={() => setJoinOpen(true)}
              >
                <div className="flex items-center justify-center bg-gray-800 h-full w-full rounded-lg py-2 px-4">
                  Join Room
                </div>
              </label>
            </div>
            <div className="w-full h-[2px] bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 " />
            <div className="mt-5 max-h-[calc(100%-120px)] overflow-y-scroll">
              {rooms?.map((room) => {
                return (
                  <Room
                    key={room.id}
                    name={room.name}
                    last_message={room.last_message}
                    active={room.id.toString() === roomId}
                    id={room.id}
                  />
                );
              })}
            </div>
            <div className="absolute bottom-0 left-0 right-0  px-3 text-gray-300 bg-gray-800">
              {/* Add new room footer */}
              <div
                className="flex items-center justify-center py-3 font-bold cursor-pointer"
                onClick={() => setCreateOpen(true)}
              >
                <p className="font-extrabold text-transparent text-lg  bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                  + Create new room
                </p>
              </div>
              <div className="w-full h-[2px] bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 " />
              <div className="flex items-center justify-center py-3 font-bold">
                Log out
              </div>
            </div>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default Chat;
