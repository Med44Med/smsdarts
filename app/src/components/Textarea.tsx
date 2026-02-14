import clsx from "clsx";

const Textarea = ({
  name,
  id,
  className,
  placeholder,
  value,
  onChange,
  rows,
}: {
  name?: string;
  id?: string;
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
}) => {
  return (
    <textarea
      name={name}
      id={id}
      className={clsx(
        "bg-background resize-none p-2 border-2 border-text/10 rounded text-white outline-none focus:border-primary",
        className,
      )}
      placeholder={placeholder}
      rows={rows}
      value={value}
      onChange={onChange}
    />
  );
};

export default Textarea;
