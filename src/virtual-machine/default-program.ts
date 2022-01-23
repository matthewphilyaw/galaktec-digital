export const sampleProgram =
  '# RISC V Emulator\n' +
  '# NOTE: Not all instructions are implemented yet; this is a \n' +
  '# work in progress. \n' +
  '\n' +
  '# Load: loads program and resets VM.\n' +
  '# Run: run the instruction through a five-stage pipeline.\n' +
  '# Step: manually step through each stage of the pipeline.\n' +
  '\n' +
  '# The five stages are: Fetch (FE), Decode (DE), Execute (EX),\n' +
  '# Memory Access (MEM) and Write Back (WB).\n' +
  '\n' +
  '# This sample program plays with pushing the return address on the\n' +
  '# stack and then popping before returning from the routine to ensure\n' +
  '# it makes it back to the right location.\n' +
  'start:\n' +
  '\n'+
  '# Set the stack pointer (SP) to the end of RAM intentionally to\n' +
  '# allow each push to do an "addi" to grow the stack before setting\n' +
  '# a value without worrying about special cases (at least in this\n' +
  '# simple program).\n' +
  'addi sp, 0xc0(zero)\n' +
  '\n' +
  '# Stores an increment value in RAM @ 0x90\n' +
  '# and each time through the loop, the increment is increased by 1\n' +
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
  '    \n' +
  '    # Store function arg (a1) into ram.\n' +
  '    sw a1, 0x80(zero)\n' +
  '    \n' +
  '    # Pop value off of the stack.\n' +
  '    lw ra, 0(sp)\n' +
  '    addi sp, 4(sp)\n' +
  '    \n' +
  '    ret\n' +
  '\n' +
  'add_routine:\n' +
  '    # Push ra on the stack.\n' +
  '    addi sp, -4(sp)\n' +
  '	   sw ra, 0(sp)\n' +
  '\n' +
  '	# Taking increment stored in RAM @ 0x90\n' +
  '    # and always add 11 to it.\n' +
  '    lw t1, 0x90(zero)\n' +
  '    \n' +
  '    # This is not optimal code; it is simply exercising\n' +
  '    # the various instructions.\n' +
  '    addi t2, zero, 11\n' +
  '    \n' +
  '    # Use a1 to follow the ABI for passing function args.\n' +
  '    add a1, t1, t2\n' +
  '    \n' +
  '    # Jump to routine.\n' +
  '    jal ra, store\n' +
  '    \n' +
  '    # Pop value off of the stack.\n' +
  '    lw ra, 0(sp)\n' +
  '    addi sp, 4(sp)\n' +
  '\n' +
  '    ret\n';