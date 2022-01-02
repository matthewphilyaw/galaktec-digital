import styles from './Button.module.css';

export interface ButtonProps {
  icon?: string;
  text?: string;
  onClick?: () => void;
  size?: 'small' | 'medium';
}

export function Button(props: ButtonProps) {
  const { icon, text, onClick } = props;
  let size = props.size;

  if (!size) {
    size = 'medium';
  }

  return (
    <button className={ styles.button } onClick={onClick}>
      { icon &&
      <span className={ ['material-icons-outlined', (size === 'small' ? 'md-18' : 'md-24') ].join(' ')}>{icon}</span>
      }
      { text &&
      <span className={ size === 'small' ? styles.buttonTextSmall : styles.buttonTextMedium }>{text}</span>
      }
    </button>
  )
}