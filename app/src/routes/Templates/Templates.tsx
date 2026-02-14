import Button from "@/components/Button";
import Surface from "@/components/Surface";
import { H1, Text } from "@/components/Text";
import { useEffect, useState } from "react";
import AddTemplate from "./AddTemplate";
import { FaEdit } from "react-icons/fa";
import supabase from "@/utilis/supabase";
import EditTemplate from "./EditTemplate";

type Template = {
  id?: string;
  title: string;
  message: string;
};

const Templates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [addTemplate, setAddTemplate] = useState(false);
  const [editTemplate, setEditTemplate] = useState<boolean>(false);
  const [editTemplateData, setEditTemplateData] = useState<Template | null>(
    null,
  );

  useEffect(() => {
    (async () => {
      setError(null);
      setLoading(true);
      try {
        const { data, error } = await supabase.from("templates").select("*");
        if (error) throw error;
        setTemplates(data!);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleEdit = (id: string) => {
    setEditTemplate(true);
    setEditTemplateData(templates.find((t) => t.id === id)!);
  };

  return (
    <Surface className="h-full flex flex-col gap-3">
      <H1>Templates</H1>
      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>{error.message}</Text>
      ) : templates.length === 0 ? (
        <div className="flex-1 flex flex-col justify-center items-center gap-3">
          <Text>there is no template</Text>
          <Button onClick={() => setAddTemplate(true)}>Add</Button>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 max-h-56 gap-5">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-surface-secondary p-3 rounded-2xl flex flex-col gap-2"
            >
              <div className="flex justify-between gap-3 items-center">
                <Text className="font-bold line-clamp-1">{template.title}</Text>
                <FaEdit
                  onClick={() => handleEdit(template.id!)}
                  className="text-xl cursor-pointer text-text hover:text-primary"
                />
              </div>
              <Text className="flex-1 w-full bg-background! p-3 rounded-lg text-primary!">
                {template.message}
              </Text>
            </div>
          ))}
          <div className="bg-surface-secondary p-3 rounded-2xl flex flex-col justify-center items-center gap-2">
            <Text>Add a Template</Text>
            <Button onClick={() => setAddTemplate(true)}>Add</Button>
          </div>
        </div>
      )}
      {addTemplate && (
        <AddTemplate
          show={addTemplate}
          setShow={setAddTemplate}
          setTemplates={setTemplates}
        />
      )}
      {editTemplate && editTemplateData && (
        <EditTemplate
          show={editTemplate}
          setShow={setEditTemplate}
          setTemplates={setTemplates}
          template={editTemplateData}
        />
      )}
    </Surface>
  );
};

export default Templates;
