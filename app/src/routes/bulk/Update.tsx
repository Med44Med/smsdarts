import Select from "@/components/Select";
import { H1, SubText } from "@/components/Text";
import clsx from "clsx";
import { useRef, useState } from "react";
import { LuUpload } from "react-icons/lu";

const Update = ({
  setFile,
  templates,
  selectedTemplate,
  setSelectedTemplate,
  variables,
}: {
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  templates: { title: string; message: string }[];
  selectedTemplate: { title: string; message: string } | null;
  setSelectedTemplate: React.Dispatch<
    React.SetStateAction<{ title: string; message: string } | null>
  >;
  variables: string[];
}) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setFile(file);
    }
  };
  return (
    <>
      <div className="flex flex-col gap-1">
        <H1>Send Bulk Messages</H1>
        <SubText secondary>
          Send bulk messages to multiple recipients at once using CSV file or
          Excel file.
        </SubText>
        <Select
          onChange={(e) =>
            setSelectedTemplate(
              e.target.value
                ? (templates.find((t) => t.title === e.target.value) ?? null)
                : null,
            )
          }
          className="w-1/2"
        >
          <Select.Option value={undefined}>Select Template</Select.Option>
          {templates.map((template) => (
            <Select.Option key={template.title} value={template.title}>
              {template.title}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={clsx(
          "flex-1 border-2 border-dashed border-primary rounded-xl flex flex-col items-center justify-center gap-3",
          isDraggingOver && "border-primary-hover bg-primary/10",
        )}
      >
        <div className="w-full p-5 flex flex-col items-center gap-2">
          <div className="bg-white w-full p-5 rounded-xl">
            {selectedTemplate && variables.length > 0 ? (
              <div className="flex items-center">
                <SubText className="text-black/80! flex-1 text-center border">
                  To
                </SubText>
                {variables.map((variable) => (
                  <SubText
                    className="text-black/80! flex-1 text-center border border-l-0"
                    key={variable}
                  >
                    {variable}
                  </SubText>
                ))}
              </div>
            ) : (
              <div className="flex items-center">
                <SubText className="text-black/80! flex-1 text-center border">
                  To
                </SubText>
                <SubText className="text-black/80! flex-1 text-center border border-l-0">
                  Message
                </SubText>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <SubText>Upload CSV file</SubText>
            <LuUpload className="cursor-pointer text-2xl text-text bg-primary p-1 rounded" />
          </div>
        </div>
      </div>
      <input
        type="file"
        className="hidden"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        ref={fileInputRef}
        onChange={(e) => handleFileUpload(e)}
      />
    </>
  );
};

export default Update;
