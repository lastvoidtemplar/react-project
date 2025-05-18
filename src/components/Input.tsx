
type InputProp = {
    labelFor?: string
    labelText?: string
    inputType: string,
    disabled?: boolean
    ref?: React.RefObject<HTMLInputElement | null>
}

function Input({labelFor, labelText, inputType, disabled, ref}:InputProp) {
  return (
    <div className="flex flex-col">
      <label htmlFor={labelFor}>{labelText}</label>
      <input id={labelFor} type={inputType} disabled={disabled} ref={ref} className="border-2 border-black px-2 py-1 rounded-sm"/>
    </div>
  );
}

export default Input;
