import Button from "@/components/Button";
import Input from "@/components/Input";
import Popup from "@/components/Popup";
import { H1, SubText, Text } from "@/components/Text";
import Textarea from "@/components/Textarea";
import { AuthContext } from "@/context/contexts";
import type { AuthContextType } from "@/types";
import supabase from "@/utilis/supabase";
import { useContext, useState } from "react";

type TemplateType = {
  id?: string;
  title: string;
  message: string;
};

const AddTemplate = ({
  show,
  setShow,
  setTemplates,
}: {
  show: boolean;
  setShow: (show: boolean) => void;
  setTemplates: React.Dispatch<React.SetStateAction<TemplateType[]>>;
}) => {
  const auth = useContext<AuthContextType | null>(AuthContext);
  const { user } = auth!;
  const [template, setTemplate] = useState<TemplateType>({
    title: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleAdd = async () => {
    setError(null);
    setLoading(true);
    try {
      if (!template.title || !template.message) {
        throw new Error("Please fill all the fields");
      }
      const { data, error } = await supabase
        .from("templates")
        .insert([{ client: user?.id, ...template }])
        .select();
      if (error) throw error;
      setTemplates((prev) => [...prev, data![0]]);
      setTemplate({
        title: "",
        message: "",
      });
      setShow(false);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popup show={show} setShow={setShow} className="flex flex-col gap-5">
      <H1>Add Template</H1>
      <Input
        type="text"
        label="Template Title :"
        placeholder="Your template name"
        className="w-1/2"
        value={template.title}
        onChange={(e) => setTemplate({ ...template, title: e.target.value })}
      />
      <div className="w-2/3 flex flex-col gap-3">
        <Text>Template Message :</Text>
        <SubText secondary>
          {`Use double brackets to add a variable`}
          <br />
          {`e.g : {{ Variable Name }}`}
        </SubText>
        <Textarea
          placeholder="Template Message"
          className="w-2/3! h-32!"
          value={template.message}
          onChange={(e) =>
            setTemplate({ ...template, message: e.target.value })
          }
        />
      </div>
      <Button className="mt-auto" onClick={handleAdd}>
        {loading ? "Loading..." : "Add"}
      </Button>
      {error && <Text className="text-red-500/80!">{error.message}</Text>}
    </Popup>
  );
};

export default AddTemplate;
