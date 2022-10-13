import styles from './AppHeader.module.css';
import Plate from '../components/layout/Plate';
import FlexCenteredContent from '../components/layout/FlexCenteredContent';
import {H1, H2} from '../components/layout/Heading';
import gitHubLogo from '../images/GitHub-Mark-64px.png';

export interface AppHeaderProps {
  screenName: string;
}

export default function AppHeader({ screenName }: AppHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.screenLabel}>
        <Plate>
          <FlexCenteredContent>
            <H2>{screenName}</H2>
          </FlexCenteredContent>
        </Plate>
      </div>
      <div className={styles.logo}>
        <Plate>
          <FlexCenteredContent>
            <H1>GALAKTEC DIGITAL</H1>
            <H2>RISC V | VM</H2>
          </FlexCenteredContent>
        </Plate>
      </div>
      <div className={styles.repoLink}>
        <Plate withScrews={false}>
          <FlexCenteredContent>
            <a href={'https://github.com/matthewphilyaw/galaktec-digital'} target={'_blank'}><img src={gitHubLogo} alt={'repo link'}/></a>
          </FlexCenteredContent>
        </Plate>
      </div>
    </header>
  )
}
