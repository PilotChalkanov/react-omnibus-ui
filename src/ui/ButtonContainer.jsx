function ButtonContainer({ children, margin = true, className }) {
  return (
    <div
      className={`flex ${
        margin && "mt-4"
      } ${className} justify-start items-center gap-2`}
    >
      {children}
    </div>
  );
}

export default ButtonContainer;
