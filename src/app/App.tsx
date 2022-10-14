import {useEffect, useState} from 'react';
import styles from './App.module.css';
import {getListOfThemeColors} from '../theme/theme';
import EmulatorScreen from '../screens/EmulatorScreen/EmulatorScreen';
import AppHeader from './AppHeader';
import AppStatusBar from './AppStatusBar';
import {VirtualMachineProvider} from '../hooks/use-virtual-machine';
import LoadingScreen from '../screens/Loading/LoadingScreen';
import Display from '../components/layout/Display';

export default function App() {
  const screenName = 'Emulator';
  const [loading, setLoading] = useState(true);

  // set css variables
  useEffect(() => {
    const htmlElement = document.getElementsByTagName('html')[0];
    for (const color of getListOfThemeColors()) {
      htmlElement.style.setProperty(color.cssKey, color.value);
    }
  }, [])

  if (loading) {
    return (
      <Display>
        <LoadingScreen setLoading={setLoading}/>
      </Display>
    );
  }

  return (
    <Display>
      <div className={`${styles.App} ${styles.fadeIn}`}>
      <AppHeader screenName={screenName} />
      <div className={styles.content}>
        <VirtualMachineProvider>
          <EmulatorScreen />
        </VirtualMachineProvider>
      </div>
      <AppStatusBar />
      </div>
    </Display>
  );
}