import appBarStyles from './AppBar.module.css';
import './index.css';
import {Button} from './Button';

export interface AppBarProps {
  onLoad: () => void;
  onStepInstruction: () => void;
  onRunInstruction: () => void;
}



export default function AppBar(props: AppBarProps) {
  const { onLoad, onStepInstruction, onRunInstruction } = props;

  return (
    <div className={appBarStyles.AppBar}>
      <div className={appBarStyles.logo}>
        <h1 className="reset-margin">GALAKTEC DIGITAL</h1>
        <span className="reset-margin">A division of Gigadyne Systems</span>
      </div>
      <div className={appBarStyles.controls}>
        <Button icon={"save"} text={"Load"} onClick={onLoad}/>
        <Button icon={"play_arrow"} text={"Step instruction"} onClick={onStepInstruction}/>
        <Button icon={"fast_forward"} text={"Run instruction"} onClick={onRunInstruction}/>
      </div>
      <nav className={appBarStyles.menu}>
        <Button icon={"menu"} />
      </nav>
    </div>
  );
}