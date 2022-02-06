export const sampleProgram =
  '# RISC V Emulator\n' +
  '# This emulator has a five stage pipeline:\n' +
  '# 1. Fetch (FE)\n' +
  '# 2. Decode (DE)\n' +
  '# 3. Execute (EX)\n' +
  '# 4. Memory Access (MEM)\n' +
  '# 5. Write Back (WB)\n' +
  '\n' +
  '# Load: loads program and resets VM.\n' +
  '# Step Instruction: step through each stage.\n' +
  '# Run Instruction: executes single instruction.\n' +
  '\n' +
  '# This sample program demonstrates using the stack\n' +
  '# to keep track of return addresses. \n' +
  'start:\n' +
  '\n' +
  '# Setting the stack pointer (SP) to the\n' +
  '# end of RAM (intentionally) allows each\n' +
  '# push to do an "addi" to grow the stack before\n' +
  '# setting a value without worrying about special\n' +
  '# cases in this simple program.\n' +
  'addi sp, 0xc0(zero)\n' +
  '\n' +
  '# Stores an increment value in RAM @ 0x90\n' +
  '# and each time through the loop,\n' +
  '# the increment is increased by 1\n' +
  'loop:\n' +
  '    jal ra, add_routine\n' +
  '\n' +
  '    lw t1, 0x90(zero)\n' +
  '    addi t1, t1, 1\n' +
  '    sw t1, 0x90(zero)\n' +
  '\n' +
  '    jal zero, loop\n' +
  '\n' +
  'store:\n' +
  '    # Push ra on  the stack.\n' +
  '    addi sp, -4(sp)\n' +
  '	sw ra, 0(sp)\n' +
  '\n' +
  '\n' +
  '    # Store function arg (a1) into ram.\n' +
  '    sw a1, 0x80(zero)\n' +
  '\n' +
  '    # Pop value off of the stack.\n' +
  '    lw ra, 0(sp)\n' +
  '    addi sp, 4(sp)\n' +
  '\n' +
  '    ret\n' +
  '\n' +
  'add_routine:\n' +
  '    # Push ra on the stack.\n' +
  '    addi sp, -4(sp)\n' +
  '	   sw ra, 0(sp)\n' +
  '\n' +
  '	   # Take increment stored in RAM @ 0x90\n' +
  '    # and always add 11 to it.\n' +
  '    lw t1, 0x90(zero)\n' +
  '\n' +
  '    # This is not optimal code; it is simply\n' +
  '    # exercising the various instructions.\n' +
  '    addi t2, zero, 11\n' +
  '\n' +
  '    # Use a1 to follow the ABI for passing\n' +
  '    # function args.\n' +
  '    add a1, t1, t2\n' +
  '\n' +
  '    # Jump to routine.\n' +
  '    jal ra, store\n' +
  '\n' +
  '    # Pop value off of the stack.\n' +
  '    lw ra, 0(sp)\n' +
  '    addi sp, 4(sp)\n' +
  '\n' +
  '    ret\n';
