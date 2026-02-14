import Button from "@/components/Button";
import Surface from "@/components/Surface";
import { Text } from "@/components/Text";
import { AuthContext } from "@/context/contexts";
import type { AuthContextType } from "@/types";
import { useContext } from "react";
import { FaCheckCircle } from "react-icons/fa";

const Profile = () => {
  const auth = useContext<AuthContextType | null>(AuthContext)
  const {user} = auth!
  return (
    <Surface className="flex flex-col gap-5">
      <div className="flex flex-col items-center gap-1">
        <div className="mb-3 size-40 rounded-full border-4 border-text/10">
          <img
            src={user?.avatar_url || 'https://ui-avatars.com/api/?name=' + user?.username}
            alt=""
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <Text className="text-xl font-bold">{user?.username}</Text>
        <div className="flex items-center gap-1 ">
          <Text secondary>{user?.email}</Text>
          <FaCheckCircle className="text-primary" />
        </div>
      </div>
      <Button type="link" href="/settings/profile" className="w-56 mx-auto">
        Edit Profile
      </Button>
    </Surface>
  );
};

export default Profile;
