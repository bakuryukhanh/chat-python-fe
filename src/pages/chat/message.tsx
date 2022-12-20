import { Avatar, Tooltip } from "antd";
import moment from "moment";
import { useMemo } from "react";
import { getImageUrl } from "../../utils";

const API = "http://localhost:8080";

const Message = ({ message }) => {
  const messageContent = useMemo(() => {
    if (message.attachments?.length > 0) {
      return (
        <img
          src={`${API}${message.attachments[0].url}`}
          alt="image"
          className="w-auto h-auto max-w-md"
        />
      );
    }
    return <p className="text-gray-300">{message.content}</p>;
  }, [message]);
  if (!message.is_first) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-start">
          <div className="flex gap-4 items-center ">
            <div className="w-10" />
            <Tooltip
              overlay={moment(message.sender.created_at).format(
                "DD/MM/YYYY HH:mm"
              )}
            >
              {messageContent}
            </Tooltip>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-start">
        <div className="flex gap-4 items-start ">
          <Avatar src={getImageUrl(message.sender.name)} size={40} />
          <div className="gap-2">
            <p className="font-bold">
              {message.sender.name}
              <span className="text-gray-500 ml-2 font-normal">
                ( {message.sender.email} )
              </span>
              <span className="text-gray-500 ml-2 font-normal">
                {moment(message.sender.created_at).format("DD/MM/YYYY HH:mm")}
              </span>
            </p>
            {messageContent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
