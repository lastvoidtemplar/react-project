type ButtonProp = {
  children?: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler;
};

function Button({ children, className, onClick }: ButtonProp) {
  return (
    <button
      className={
        "text-gray-900 bg-white border-2 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-lg px-5 py-2.5   "+
        " " +
        className
      }
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
