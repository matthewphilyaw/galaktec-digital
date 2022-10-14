import styles from './AppStatusBar.module.css';
import Plate from '../components/layout/Plate';
import FlexCenteredContent from '../components/layout/FlexCenteredContent';
import {H4} from '../components/layout/Heading';

export default function AppStatusBar() {
  return (
    <div className={styles.statusBar}>
      <div className={styles.poweredByLabel}>
        <Plate>
          <FlexCenteredContent>
            <H4>Property of Gigadyne Systems</H4>
          </FlexCenteredContent>
        </Plate>
      </div>
    </div>
  );
}