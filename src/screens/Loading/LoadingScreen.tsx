import styles from './LoadingScreen.module.css';
import {ReactNode, useEffect, useState} from 'react';
import {H4} from '../../components/layout/Heading';

export interface LoadingScreenProps {
  setLoading: (state: boolean) => void;
}

export default function LoadingScreen({ setLoading }: LoadingScreenProps) {
  const [logs, setLogs] = useState<ReactNode[]>([]);
  const [message, setMessage] = useState<string>('Initializing');

  useEffect(() => {
    let currentMessage = 0;

    const messageInterval = setInterval(() => {

      if (currentMessage >= messages.length) {
        clearInterval(messageInterval);
        return;
      }

      setMessage(messages[currentMessage]);
      currentMessage++;
    }, 250);

    const logInterval = setInterval(() => {
      const randomValue = Math.random();
      if (randomValue < 0.30) {
        return;
      }

      const width = Math.max(Math.floor(Math.random() * 100), 5);
      const colorChance = Math.floor(Math.random() * 3);
      let colorClass = styles.lightColor;

      if (colorChance === 1) {
        colorClass = styles.normalColor;
      } else if (colorChance === 2) {
        colorClass = styles.darkColor;
      }

      const line = <div className={`${styles.fakeContent} ${colorClass}`} style={{width: `${width}%`}} />;
      setLogs(l => [line, ...l])
    }, 40);

    return () => {
      clearInterval(messageInterval);
      clearInterval(logInterval);
    };
  }, [])


  return (
    <div className={styles.content}>
      <div className={styles.hidden}>
        <div style={{font: '300 1rem Roboto'}}>&nbsp;test</div>
        <div style={{font: '400 1rem Roboto'}}>&nbsp;test</div>
        <div style={{font: '500 1rem Roboto'}}>&nbsp;test</div>
        <div style={{font: '700 1rem Roboto'}}>&nbsp;test</div>
        <div style={{font: '900 1rem Roboto'}}>&nbsp;test</div>
        <div style={{font: '300 1rem Roboto mono'}}>&nbsp;test</div>
        <div style={{font: '400 1rem Roboto mono'}}>&nbsp;test</div>
        <div style={{font: '500 1rem Roboto mono'}}>&nbsp;test</div>
        <div style={{font: '700 1rem Roboto mono'}}>&nbsp;test</div>
        <div style={{font: '900 1rem Roboto mono'}}>&nbsp;test</div>
      </div>
      <div className={styles.loading}>
        <div>
          <H4>{message}</H4>
        </div>
        <div className={styles.meter}>
          <span className={styles.bar} onAnimationEnd={() => setLoading(false) } />
        </div>
        <div className={styles.statusContainer}>
          <div className={styles.vertSpacer} />
          <div className={styles.fakeContentContainer}>
            {logs}
          </div>
          <div className={styles.vertSpacer} />
        </div>
      </div>
    </div>
  )
}

const messages = [
  'Initializing important things.',
  'Setting up random items.',
  'Plugging the power cable in.',
  'Pressing the power button with eyes closed.',
  'Secretly distracting you while web fonts load.',
  'And yes, the logs below are a lie.',
];