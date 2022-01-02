import appBarStyles from './AppBar.module.css';
import './index.css';
import {ButtonGroup, Buttons} from './components/ButtonGroup';

export interface AppBarProps {
  onLoad: () => void;
  onStepInstruction: () => void;
  onRunInstruction: () => void;
}



export default function AppBar(props: AppBarProps) {
  const { onLoad, onStepInstruction, onRunInstruction } = props;

  const controlButtons: Buttons[] = [
    {
      icon: 'save',
      text: 'Load',
      onClick: onLoad
    },
    {
      icon: 'play_arrow',
      text: 'Step instruction',
      onClick: onStepInstruction
    },
    {
      icon: 'fast_forward',
      text: 'Run instruction',
      onClick: onRunInstruction
    },
  ];

  const menuButtons: Buttons[] = [
    {
      icon: 'menu',
    }
  ];

  return (
    <div className={appBarStyles.AppBar}>
      <div className={appBarStyles.logo}>
        <h1 className="reset-margin">GALAKTEC DIGITAL</h1>
        <span className="reset-margin">A division of Gigadyne Systems</span>
      </div>
      <ButtonGroup buttons={controlButtons} size={'medium'} />
      <nav className={appBarStyles.menu}>
        <ButtonGroup buttons={menuButtons} size={'medium'} />
      </nav>
    </div>
  );
}