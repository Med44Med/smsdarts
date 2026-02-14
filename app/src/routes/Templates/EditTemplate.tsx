import Button from "@/components/Button";
import Input from "@/components/Input";
import Popup from "@/components/Popup";
import { H1, SubText, Text } from "@/components/Text";
import Textarea from "@/components/Textarea";
import supabase from "@/utilis/supabase";
import { useState } from "react";

type TemplateType = {
  id?: string;
  title: string;
  message: string;
};

const EditTemplate = ({
  show,
  setShow,
  setTemplates,
  template,
}: {
  show: boolean;
  setShow: (show: boolean) => void;
  setTemplates: React.Dispatch<React.SetStateAction<TemplateType[]>>;
  template: TemplateType;
}) => {
  const [editTemplate, setEditTemplate] = useState<TemplateType>({
    title: template.title,
    message: template.message,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleEdit = async () => {
    setError(null);
    setLoading(true);
    try {
      if (!editTemplate.title || !editTemplate.message) {
        throw new Error("Please fill all the fields");
      }
      const { data, error } = await supabase
        .from("templates")
        .update(editTemplate)
        .eq("id", template.id)
        .select();
      if (error) throw error;
      setTemplates((prev) =>
        prev.map((t) => (t.id === template.id ? data![0] : t)),
      );
      setEditTemplate({
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
    <Popup show={show} setShow={setShow} className="flex flex-col gap-5" >
      <H1>Add Template</H1>
      <Input
        type="text"
        label="Template Title :"
        placeholder="Your template name"
        className="w-1/2"
        value={editTemplate.title}
        onChange={(e) =>
          setEditTemplate({ ...editTemplate, title: e.target.value })
        }
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
          value={editTemplate.message}
          onChange={(e) =>
            setEditTemplate({ ...editTemplate, message: e.target.value })
          }
        />
      </div>
      <Button className="mt-auto" onClick={handleEdit}>
        {loading ? "Loading..." : "Edit"}
      </Button>
      {error && <Text className="text-red-500/80!">{error.message}</Text>}
    </Popup>
  );
};

export default EditTemplate;
