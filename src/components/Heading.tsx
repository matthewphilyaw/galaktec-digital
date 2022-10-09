import styles from './Heading.module.css';
import {ReactNode} from 'react';

export interface HeadingProps {
  resetStyling?: boolean;
  children: ReactNode;
}

export const H1 = ({resetStyling = true, children}: HeadingProps) => <h1 className={resetStyling ? styles.reset : ''}>{children}</h1>;
export const H2 = ({resetStyling = true, children}: HeadingProps) => <h2 className={resetStyling ? styles.reset : ''}>{children}</h2>;
export const H3 = ({resetStyling = true, children}: HeadingProps) => <h3 className={resetStyling ? styles.reset : ''}>{children}</h3>;
export const H4 = ({resetStyling = true, children}: HeadingProps) => <h4 className={resetStyling ? styles.reset : ''}>{children}</h4>;
