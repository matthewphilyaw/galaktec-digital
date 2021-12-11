
export interface ButtonProps {
  icon?: string;
  text?: string;
  onClick?: () => void;
}

export function Button(props: ButtonProps) {
  const { icon, text, onClick } = props;
  return (
    <button className={"button"} onClick={onClick}>
      {icon &&
      <span className={["button-icon", "material-icons-outlined"].join(' ')}>{icon}</span>
      }
      { text &&
      <span className={"button-text"}>{text}</span>
      }
    </button>
  )
}