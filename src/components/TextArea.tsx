type TextAreaProp = {
  labelFor?: string;
  labelText?: string;
  ref?: React.RefObject<HTMLTextAreaElement | null>;
  disabled?: boolean;
  OnChange?: (e: string) => void;
};

function TextArea({
  labelFor,
  labelText,
  ref,
  disabled,
  OnChange,
}: TextAreaProp) {
  return (
    <div className="flex flex-col">
      <label htmlFor={labelFor}>{labelText}</label>
      <textarea
        id={labelFor}
        ref={ref}
        onChange={(e) => {
          if (OnChange) {
            OnChange(e.target.value);
          }
        }}
        disabled={disabled}
        className="border-2 border-black px-2 py-1 rounded-sm"
      />
    </div>
  );
}

export default TextArea;
