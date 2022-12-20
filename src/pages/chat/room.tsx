import { Avatar } from "antd";
import { getImageUrl } from "../../utils";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";

type Props = {
  name: string;
  last_message: string;
  active?: boolean;
  id: string;
};

const Room = ({ name, last_message, active, id }: Props) => {
  const navigate = useNavigate();
  return (
    <div
      className={classNames(
        "flex items-center my-6 cursor-pointer gap-3 -mr-3 p-3 rounded-l-3xl transition-all",
        {
          "bg-gray-700": active,
        }
      )}
      onClick={() => {
        navigate(`/chat/${id}`);
      }}
    >
      <Avatar src={getImageUrl(name)} size={40} />
      <div className="flex flex-col">
        <h1 className="text-lg font-bold text-gray-300">{name}</h1>
        <p className="text-sm text-gray-500">{last_message}</p>
      </div>
    </div>
  );
};

export default Room;
