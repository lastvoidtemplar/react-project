import { X } from "lucide-react";
import React, { type FormEvent } from "react";

type InputListProps = {
  initialTags: string[]
  onChange?: (e: string[]) => void;
  labelText?: string
  disabled?: boolean
};

function InputList({initialTags, onChange,labelText, disabled }: InputListProps) {
  const [tags, setTags] = React.useState<string[]>(initialTags);
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  React.useLayoutEffect(()=>{
    setTags(initialTags)
  }, [initialTags])

  React.useEffect(() => {
    if (onChange) {
      onChange(tags);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChange, tags.length]);

  const addTag = React.useCallback((e: FormEvent) => {
    e.preventDefault();
    if (inputRef.current) {
      const newTag = inputRef.current.value.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags((tags) => {
          return [...tags, newTag];
        });
      }
      inputRef.current.value = "";
    }
  }, [tags]);

  return (
    <div className="basis-2/5 flex flex-wrap items-center gap-1 p-1 border-2 rounded-md">
      <label>{labelText} </label>
      {tags.map((tag, ind) => (
        <div
          key={ind}
          className="border-2 px-2 py-1 rounded-lg flex items-center gap-1"
        >
          {tag}
          <button
            className="cursor-pointer"
            onClick={() => {
              setTags((tags) => tags.filter((t) => t !== tag));
            }}
          >
            <X size={15} />
          </button>
        </div>
      ))}
      {(!disabled)&&<form onSubmit={addTag}>
        <input type="text" ref={inputRef} className="p-1" />
      </form>}
    </div>
  );
}

export default InputList;
