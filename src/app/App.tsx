import {useEffect} from 'react';
import styles from './App.module.css';
import {colorsInHex, getListOfThemeColors} from '../theme/theme';
import EmulatorScreen from '../screens/EmulatorScreen';
import AppHeader from './AppHeader';
import AppSatusBar from './AppStatusBar';


export default function App() {
  const screenName = 'Emulator';

  // set css variables
  useEffect(() => {
    const htmlElement = document.getElementsByTagName('html')[0];

    for (const color of getListOfThemeColors()) {
      htmlElement.style.setProperty(color.cssKey, color.value);
    }
  }, [])

  return (
    <div className={styles.App}>
      <AppHeader screenName={screenName} />
      <EmulatorScreen />
      <AppSatusBar />
    </div>
  );
}