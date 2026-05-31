type ButtonProps = {
  children: React.ReactNode;
  variant: "primary" | "danger" | "default" | "outline";
  type?: "button" | "submit";
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const buttonStyle = {
  primary: "text-white bg-primary hover:bg-primary-dark",
  danger: "text-white bg-danger hover:bg-danger-dark",
  default: "bg-default hover:bg-default-dark",
  outline: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
};

export default function Button({ children, variant, type = "button", className, onClick }: ButtonProps) {
  return (
    <button
      className={`${buttonStyle[variant]} cursor-pointer rounded-md px-4 py-2 text-sm font-bold transition-colors ${className ?? ""}`}
      type={type === "submit"? "submit" : "button"}
      onClick={onClick}
    >{children}</button>

  )
}
