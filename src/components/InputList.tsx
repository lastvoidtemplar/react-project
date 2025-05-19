import { X } from "lucide-react";
import React from "react";

type InputListProps = {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  labelText?: string;
  disabled?: boolean;
};

function InputList({ tags, setTags, labelText, disabled }: InputListProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const addTag = React.useCallback(() => {
    if (inputRef.current) {
      const newTag = inputRef.current.value.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags((oldTags) => [...oldTags, newTag]);
      }
      inputRef.current.value = "";
    }
  }, [tags, setTags]);

  const OnDelete = React.useCallback(
    (ind: number) => {
      setTags((oldTags) => oldTags.filter((_, i) => i !== ind));
    },
    [setTags]
  );

  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        addTag();
      }
    },
    [addTag]
  );

  return (
    <div className="basis-2/5 flex flex-wrap items-center gap-1 p-1 border-2 rounded-md">
      <label>{labelText}</label>
      {tags.map((tag, ind) => (
        <div
          key={ind}
          className="border-2 px-2 py-1 rounded-lg flex items-center gap-1"
        >
          {tag}
          <button
            className="cursor-pointer"
            onClick={() => {
              if (!disabled) {
                OnDelete(ind);
              }
            }}
          >
            <X size={15} />
          </button>
        </div>
      ))}
      {!disabled && (
        <div>
          <input
            type="text"
            ref={inputRef}
            className="p-1"
            onKeyDown={onKeyDown}
          />
        </div>
      )}
    </div>
  );
}

export default InputList;
