import styles from './MemoryViewerWidget.module.css';
import {MemoryRegionDump} from '../../virtual-machine/risc-v/cpu-cores/peripherals/memory';
import Widget from '../../components/Widget';

interface FormattedMemoryWord {
  value: string[];
  highlight: boolean;
}

interface FormattedMemoryLine {
  address: string;
  words: FormattedMemoryWord[];
}

function formatMemoryDump(dump?: MemoryRegionDump, highlightAddresses?: number[], wordsPerRow?: number): FormattedMemoryLine[] {
  const addrLines: FormattedMemoryLine[] = [];

  if (!dump) {
    return addrLines;
  }

  if (!wordsPerRow) {
    wordsPerRow = 1;
  }

  const rbDv = new DataView(dump.regionBuffer);
  for (let row = 0; row < dump.regionBuffer.byteLength; row+=(wordsPerRow * 4)) {

    const address = dump.regionInfo.startAddress + row;

    const line: FormattedMemoryLine = {
      address: address.toString(16).padStart(8, '0'),
      words: []
    };

    // highlight: highlightAddresses ? highlightAddresses.includes(address) : false,
    for (let groups = 0; groups < wordsPerRow; groups++) {
      const wordAddress = row + (groups * 4);

      let formattedWord: FormattedMemoryWord = {
        value: [],
        highlight: highlightAddresses?.includes(wordAddress) ?? false
      };

      line.words.push(formattedWord);
      if (wordAddress >= dump.regionInfo.lengthInBytes) {
        continue;
      }

      for (let word = 0; word < 4; word++) {
        const value = rbDv.getUint8(wordAddress + word);

        formattedWord.value.push(value.toString(16).padStart(2, '0'));
      }

    }

    addrLines.push(line);
  }

  return addrLines;
}

interface MemoryViewerWidgetProps {
  title: string;
  region: MemoryRegionDump;
  highlightAddresses?: number[];
  wordsPerRow?: number;
}

export default function MemoryViewerWidget({ title, region, highlightAddresses, wordsPerRow }: MemoryViewerWidgetProps) {
  const formattedMemory = formatMemoryDump(region, highlightAddresses, wordsPerRow);

  return (
    <Widget title={title}>
      <div className={styles.content}>
        {formattedMemory.map((line) => {
          return (
            <div className={styles.line} key={line.address}>
              <div className={styles.address}>{line.address}</div>
              <div className={styles.separator}></div>
              <div className={styles.wordLine}>
                {line.words.map((word, i) => {
                  return (
                    <div key={i} className={`${styles.word} ${word.highlight ? styles.wordHighlight : ''}`}>
                      {word.value.map((byte, i) => <div className={styles.valueByte} key={i}>{byte}</div>)}
                    </div>
                  )
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Widget>
  );
}