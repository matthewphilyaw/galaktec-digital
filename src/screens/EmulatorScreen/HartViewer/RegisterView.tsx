import styles from './RegisterView.module.css';
import {formatAsHex} from '../../../utils/number-formatting';

export interface RegisterViewerWidgetProps {
  registerValues: number[];
  numberPerColumn: number;
  displayHex?: boolean;
}

interface RegisterInfo {
  name: string;
  aliases: string[];
}

interface RegisterGroup {
  registers: RegisterInfo[];
  values: number[];
}

const registerNames: RegisterInfo[] = [
  { name: 'x0', aliases: ['zero']},
  { name: 'x1', aliases: ['ra']},
  { name: 'x2', aliases: ['sp']},
  { name: 'x3', aliases: ['gp']},
  { name: 'x4', aliases: ['tp']},
  { name: 'x5', aliases: ['t0']},
  { name: 'x6', aliases: ['t1']},
  { name: 'x7', aliases: ['t2']},
  { name: 'x8', aliases: ['s0', 'fp']},
  { name: 'x9', aliases: ['s1']},
  { name: 'x10', aliases: ['a0']},
  { name: 'x11', aliases: ['a1']},
  { name: 'x12', aliases: ['a2']},
  { name: 'x13', aliases: ['a3']},
  { name: 'x14', aliases: ['a4']},
  { name: 'x15', aliases: ['a5']},
  { name: 'x16', aliases: ['a6']},
  { name: 'x17', aliases: ['a7']},
  { name: 'x18', aliases: ['s2']},
  { name: 'x19', aliases: ['s3']},
  { name: 'x20', aliases: ['s4']},
  { name: 'x21', aliases: ['s5']},
  { name: 'x22', aliases: ['s6']},
  { name: 'x23', aliases: ['s7']},
  { name: 'x24', aliases: ['s8']},
  { name: 'x25', aliases: ['s9']},
  { name: 'x26', aliases: ['s10']},
  { name: 'x27', aliases: ['s11']},
  { name: 'x28', aliases: ['t3']},
  { name: 'x29', aliases: ['t4']},
  { name: 'x30', aliases: ['t5']},
  { name: 'x31', aliases: ['t6']},
];

function formatRegisterValue(value: number, hex: boolean) {
  if (hex) {
    return formatAsHex(value);
  } else {
    return value.toString().padStart(8, ' ');
  }
}


function createColumns(registerValues: number[], numberPerGroup: number) {
  const groups: RegisterGroup[] = [];


  for (let i = 0; i < registerNames.length; i+= numberPerGroup) {
    const group: RegisterGroup = {
      registers: [],
      values: []
    };

    for (let groupIndex = 0; groupIndex < numberPerGroup && (i + groupIndex) < registerValues.length; groupIndex++) {
      group.registers.push(registerNames[i + groupIndex]);
      group.values.push(registerValues[i + groupIndex]);
    }

    groups.push(group);
  }

  return groups;
}

function RegisterColumn(column: RegisterGroup, displayHex: boolean) {
  return (
    <div key={column.registers[0].name} className={styles.column}>
      <div className={styles.registers}>
        {column.registers.map(reg => (
          <div key={reg.name} className={styles.register}>{reg.name} {(reg.aliases.join(' '))}</div>
        ))}
      </div>
      <div className={styles.values}>
        {column.values.map((val, i) => (
          <div key={i} className={styles.value}>{formatRegisterValue(val, displayHex)}</div>
        ))}
      </div>
    </div>
  );
}

export default function RegisterView({ registerValues, numberPerColumn, displayHex = false }: RegisterViewerWidgetProps) {
  const groups = createColumns(registerValues, numberPerColumn);
  const groupComponents = groups.map(col => RegisterColumn(col, displayHex));
  const divider = (key: number) => <div key={key} className={styles.separator} />;
  const groupWithDivider = [];

  groupWithDivider.push(divider(0));
  for (let i = 0; i < groupComponents.length; i++) {
    groupWithDivider.push(groupComponents[i])
    groupWithDivider.push(divider(i + 1));
  }

  return (
    <div className={styles.content}>
      {groupWithDivider}
    </div>
  );
}