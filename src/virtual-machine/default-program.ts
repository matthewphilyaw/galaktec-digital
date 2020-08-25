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
  '# load value 15 in x1\n' +
  '# and store it first word\n' +
  '# of ram\n' +
  'addi  x1, x0, 15\n' +
  'sw    x1, 0x80(x0)\n' +
  '\n' +
  '# Fetch the newley stored value\n' +
  '# from ram\n' +
  'lw    x2, 0x80(x0)\n' +
  '\n' +
  '# Take the existing value in x1\n' +
  '# and add to value loaded\n' +
  '# then store back\n' +
  'add   x3, x1, x2\n' +
  'sw    x3, 0x84(x0)\n' +
  '\n' +
  '# load value into x4\n' +
  'lw    x4, 0x84(x0)';