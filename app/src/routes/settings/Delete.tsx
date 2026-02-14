import Button from "@/components/Button";
import Surface from "@/components/Surface";
import { H1, Text } from "@/components/Text";

const Delete = () => {
  return (
    <>
      <Surface className="bg-orange-500/20! border-orange-500!">
        <H1>Delete Account</H1>
        <Text>Are you sure you want to delete your account?</Text>
        <Button className="bg-orange-500! mt-5">
          <Text>Delete Account</Text>
        </Button>
      </Surface>
    </>
  );
};

export default Delete;
