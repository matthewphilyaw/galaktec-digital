import styles from './Screw.module.css';
import {useEffect, useRef, useState} from 'react';
import {createNewBrightnessValue, RandomizeBrightnessMixin} from './utils';

export interface ScrewProps extends RandomizeBrightnessMixin { }

export default function Screw({ randomizeBrightnessPlusOrMinus }: ScrewProps) {
  const screw = useRef<HTMLDivElement>(null);
  const [rotation] = useState(Math.floor(Math.random() * 360));
  const [brightness] = useState(createNewBrightnessValue(randomizeBrightnessPlusOrMinus));

  useEffect(() => {
    console.log('running');
    if (!screw.current) {
      return;
    }

    screw.current?.style.setProperty('--screw-rotation-degrees', `${rotation}deg`);

    if (brightness) {
      screw.current?.style.setProperty('filter', brightness);
    }
  }, [brightness, rotation]);

  return (
    <div ref={screw} className={styles.screw} />
  )
}