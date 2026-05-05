type ButtonProps = {
  children: React.ReactNode;
  variant: "primary" | "danger" | "default";
  type?: "button" | "submit";
  className?: string;
}

const buttonStyle = {
  primary: "text-white bg-primary hover:bg-primary-dark",
  danger: "text-white bg-danger hover:bg-danger-dark",
  default: "bg-default hover:bg-default-dark",
}

export default function Button({ children, variant, type = "button", className }: ButtonProps) {
  return (
    <button
      className={`${buttonStyle[variant]} w-80 rounded-3xl block m-auto ${className ?? ""}`}
      type={type === "submit"? "submit" : "button"}
    >{children}</button>
  )
}