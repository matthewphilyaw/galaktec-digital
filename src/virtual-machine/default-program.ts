export const sampleProgram =
  '# Write program here\n' +
  '\n' +
  '# By clicking step you will see the VM\n' +
  '# step the virutal CPU through its 5 stage pipeline\n' +
  '# and create the side effects in te memories.\n' +
  '\n' +
  '# NOTE: One instruction takes 5 steps to fully execute\n' +
  '#       meaning you must click step 5 times to get to\n' +
  '#       next instruction. \n' +
  '\n' +
  'start:\n' +
  'addi  x5, x0, 15\n' +
  'sw    x5, 0x80(x0)\n'+
  '\n' +
  'lw x6, 0x80(x0)\n' +
  'jal x1, add_routine\n' +
  'jal x0, start\n' +
  '\n' +
  'store:\n' +
  '    sw x7, 0x80(x0)\n' +
  '    jalr x0, 0(x2)\n' +
  '\n' +
  'add_routine:\n' +
  '    add x7, x5, x6\n' +
  '    jal x2, store\n' +
  '    jalr x0, 0(x1)\n';