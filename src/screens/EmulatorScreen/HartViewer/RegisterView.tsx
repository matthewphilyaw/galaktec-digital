import styles from './RegisterView.module.css';
import {H4} from '../../../components/Heading';

interface RegisterLine {
  index: number;
  name: string;
  aliases: string[];
  value: string;
}

export interface RegisterViewerWidgetProps {
  registerValues: number[]
}

const registerLookup: Record<number, { name: string, aliases: string[] }> = {
  0: { name: 'x0', aliases: ['zero']},
  1: { name: 'x1', aliases: ['ra']},
  2: { name: 'x2', aliases: ['sp']},
  3: { name: 'x3', aliases: ['gp']},
  4: { name: 'x4', aliases: ['tp']},
  5: { name: 'x5', aliases: ['t0']},
  6: { name: 'x6', aliases: ['t1']},
  7: { name: 'x7', aliases: ['t2']},
  8: { name: 'x8', aliases: ['s0', 'fp']},
  9: { name: 'x9', aliases: ['s1']},
  10: { name: 'x10', aliases: ['a0']},
  11: { name: 'x11', aliases: ['a1']},
  12: { name: 'x12', aliases: ['a2']},
  13: { name: 'x13', aliases: ['a3']},
  14: { name: 'x14', aliases: ['a4']},
  15: { name: 'x15', aliases: ['a5']},
  16: { name: 'x16', aliases: ['a6']},
  17: { name: 'x17', aliases: ['a7']},
  18: { name: 'x18', aliases: ['s2']},
  19: { name: 'x19', aliases: ['s3']},
  20: { name: 'x20', aliases: ['s4']},
  21: { name: 'x21', aliases: ['s5']},
  22: { name: 'x22', aliases: ['s6']},
  23: { name: 'x23', aliases: ['s7']},
  24: { name: 'x24', aliases: ['s8']},
  25: { name: 'x25', aliases: ['s9']},
  26: { name: 'x26', aliases: ['s10']},
  27: { name: 'x27', aliases: ['s11']},
  28: { name: 'x28', aliases: ['t3']},
  29: { name: 'x29', aliases: ['t4']},
  30: { name: 'x30', aliases: ['t5']},
  31: { name: 'x31', aliases: ['t6']},
}

function formatRegisterValues(registers: number[]): RegisterLine[] {
  return registers.map((v, i) => {
    let value = '';
    if (Math.abs(v) > 9999999) {
      value = (v >>> 0).toString(16).padStart(8, '0');
    }
    else {
      value = v.toString().padStart(8, ' ');
    }
    value = (v >>> 0).toString(16).padStart(8, '0');


    return {
      index: i,
      name: registerLookup[i].name.padStart(3, ' '),
      aliases: registerLookup[i].aliases,
      value
    };
  });
}

export default function RegisterView({ registerValues }: RegisterViewerWidgetProps) {
  const formattedRegisters = formatRegisterValues(registerValues);
  return (
    <div className={styles['content']}>
      {formattedRegisters.map((line) =>
        <div className={styles['line']} key={line.name}>
          <div className={styles['register']}>{line.name}|{(line.aliases.join(','))}</div>
          <div className={styles['value']}>{line.value}</div>
        </div>
      )}
    </div>
  );
}