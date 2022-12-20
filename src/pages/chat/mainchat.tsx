/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  CloseCircleFilled,
  CloseCircleOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Avatar } from "antd";
import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSubWs } from "../../hooks";
import {
  requestMessages,
  requestRoomInfo,
  requestSendMessage,
} from "../../services";
import { getImageUrl } from "../../utils";
import Message from "./message";

const MainChat = () => {
  const { roomId } = useParams();
  const [input, setInput] = useState("");
  const [file, setFile] = useState<{
    file: File;
    preview: string;
  } | null>(null);
  const { data: roomInfo } = useQuery(["roomInfo", roomId], {
    queryFn: async () => {
      const res = await requestRoomInfo(roomId!);
      if (res.status === 200) {
        return res.data;
      }
    },
  });
  const queryClient = useQueryClient();

  const { data: messages } = useQuery(["messages", roomId], async () => {
    const res = await requestMessages(roomId!);
    if (res.status === 200) {
      return res.data;
    }
  });

  useSubWs("new_message", (message) => {
    queryClient.setQueryData(["messages", roomId], (prev) => {
      if (!prev) return prev;
      return [...prev, message];
    });
  });

  const formatMessage = useMemo(() => {
    return messages
      ?.map((message, idx) => {
        if (idx === 0) {
          return {
            ...message,
            is_first: true,
          };
        }
        if (message.sender.id === messages?.[idx - 1].sender.id) {
          return {
            ...message,
            is_first: false,
          };
        }
        return {
          ...message,
          is_first: true,
        };
      })
      .sort((a, b) => a.id - b.id);
  }, [messages]);

  const handleSendMessage = async () => {
    if (!roomId) return;
    if (input.length > 0) {
      const res = await requestSendMessage(roomId, {
        content: input,
        type: "text",
      });
      if (res.status === 200) {
        setInput("");
      }
    }

    if (file) {
      const fileRes = await requestSendMessage(roomId, {
        attachment: file.file,
        type: "image",
        content: "",
      });

      if (fileRes.status === 200) {
        setFile(null);
      }
    }
  };

  const handleAddAttachment = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!roomId) return;
    const file = e.target.files?.[0];
    if (!file) return;
    // create preview image link
    const preview = URL.createObjectURL(file);
    setFile({
      file: file,
      preview: preview,
    });
  };

  if (!formatMessage) return null;

  return (
    <div className="col-span-9 h-screen relative">
      {/* Chat Header */}
      <div className="bg-gray-600 flex justify-between px-6 py-2">
        <div className="w-full h-full flex  gap-3 text-gray-300 ">
          <Avatar src={getImageUrl(roomInfo?.name)} size={40} />
          <div className="flex items-center">
            <h2 className="font-bold">{roomInfo?.name}</h2>
          </div>
        </div>
        <div className="w-fit flex items-center text-right">
          <button className="bg-orange-800 text-white  rounded-lg font-bold px-4 py-2 min-w-[130px]  ">
            Leave Room
          </button>
        </div>
      </div>
      {/* Chat Body */}
      <div className="bg-gray-700 h-[calc(100%-120px)] flex flex-col-reverse justify-between text-gray-300 overflow-y-auto pb-10">
        <div className="flex flex-col-reverse gap-3 px-6 py-3">
          {formatMessage?.reverse()?.map((message) => {
            return <Message message={message} key={message.id} />;
          })}
        </div>
      </div>
      {/* Chat Footer */}
      <div className="absolute bottom-0 left-0 right-0  p-3 text-gray-300">
        <div className="flex items-end justify-center py-3 gap-6 ">
          <div className="bg-gray-800 w-full rounded-3xl overflow-hidden">
            <div className=" w-full">
              {file && (
                <div className="bg-gray-800 p-3 ">
                  <div className="relative w-fit">
                    <img
                      src={file.preview}
                      alt="preview"
                      className=" w-20 h-20 object-cover"
                    />
                    <button
                      className="absolute top-0 right-1 z-10"
                      onClick={() => {
                        setFile(null);
                      }}
                    >
                      <CloseCircleFilled className="text-gray-600" />
                    </button>
                  </div>
                </div>
              )}
              <div className="relative w-full">
                <input
                  className="bg-gray-800 h-full w-full py-4 px-4 focus:border-transparent focus:outline-none"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                />
                <label
                  htmlFor="image"
                  className="absolute right-6 top-1/2 text-xl -translate-y-1/2 transform "
                >
                  <PaperClipOutlined />
                </label>
                <input
                  type="file"
                  id="image"
                  className="hidden"
                  onChange={handleAddAttachment}
                />
              </div>
            </div>
          </div>
          <button
            className="bg-gray-500 px-6 py-3 rounded-2xl"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainChat;
