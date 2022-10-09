export const sampleProgram =
`# This sample program demonstrates using the stack
# to keep track of return addresses.

start:

# Setting the stack pointer (SP) to the
# end of RAM (intentionally) allows each
# push to do an "addi" to grow the stack before
# setting a value without worrying about special
# cases in this simple program.

addi sp, 0xc0(zero)

# Stores an increment value in RAM @ 0x90
# and each time through the loop,
# the increment is increased by 1
loop:
    jal ra, add_routine
    lw t1, 0x90(zero)

    addi t1, t1, 1

    sw t1, 0x90(zero)
    jal zero, loop

store:
    # Push ra on  the stack.
    addi sp, -4(sp)
    sw ra, 0(sp)

    # Store function arg (a1) into ram.
    sw a1, 0x80(zero)

    # Pop value off of the stack.
    lw ra, 0(sp)
    addi sp, 4(sp)

    ret

add_routine:
    # Push ra on the stack.
    addi sp, -4(sp)
    sw ra, 0(sp)

    # Take increment stored in RAM @ 0x90
    # and always add 11 to it.
    lw t1, 0x90(zero)

    # This is not optimal code; it is simply
    # exercising the various instructions.
    addi t2, zero, 11

    # Use a1 to follow the ABI for passing
    # function args.
    add a1, t1, t2

    # Jump to routine.
    jal ra, store

    # Pop value off of the stack.
    lw ra, 0(sp)
    addi sp, 4(sp)

    ret`;
