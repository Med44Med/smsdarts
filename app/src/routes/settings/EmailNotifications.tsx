import Surface from "@/components/Surface";
import Switch from "@/components/Switch";
import { H1, SubText, Text } from "@/components/Text";
import { useState } from "react";

const EmailNotifications = () => {
  const [newsletter, setNewsletter] = useState(true);
  console.log(newsletter);

  return (
    <Surface>
      <H1 className="mb-5">Email Notifications</H1>
      <div className="w-full flex flex-col gap-5">
        <div className="flex items-center gap-5">
          <Switch value={newsletter} onChange={setNewsletter} className="min-w-12" />
          <div className="flex flex-col gap-0.5">
            <Text>Enable Email Newsletter</Text>
            <SubText secondary>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas
              suscipit numquam, quis dicta, voluptatum accusamus nulla minima
              blanditiis earum veniam nam expedita! Aut ducimus expedita
              recusandae itaque adipisci ipsum consequuntur.
            </SubText>
          </div>
        </div>
      </div>
    </Surface>
  );
};

export default EmailNotifications;
