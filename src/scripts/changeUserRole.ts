import { PrismaClient } from '@prisma/client';
import readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const validRoles = ['USER', 'ADMIN'] as const;
type UserRole = typeof validRoles[number];

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

async function changeUserRole() {
  try {
    // Get email
    const email = await question('Enter user email: ');

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    if (!user) {
      console.error('\x1b[31mError: User not found\x1b[0m');
      process.exit(1);
    }

    console.log('\nCurrent user info:');
    console.log('------------------');
    console.log(`Name: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Current Role: ${user.role}`);
    console.log('\nAvailable roles:', validRoles.join(', '));

    // Get new role
    const newRole = await question('\nEnter new role: ');

    if (!validRoles.includes(newRole as UserRole)) {
      console.error('\x1b[31mError: Invalid role. Must be one of:', validRoles.join(', '), '\x1b[0m');
      process.exit(1);
    }

    // Confirm change
    const confirm = await question(`\nAre you sure you want to change ${user.email}'s role from ${user.role} to ${newRole}? (y/N): `);

    if (confirm.toLowerCase() !== 'y') {
      console.log('\x1b[33mOperation cancelled\x1b[0m');
      process.exit(0);
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: newRole as UserRole },
      select: {
        name: true,
        email: true,
        role: true
      }
    });

    console.log('\n\x1b[32mUser role updated successfully!\x1b[0m');
    console.log('------------------');
    console.log(`Name: ${updatedUser.name}`);
    console.log(`Email: ${updatedUser.email}`);
    console.log(`New Role: ${updatedUser.role}`);

  } catch (error) {
    console.error('\x1b[31mError:', error instanceof Error ? error.message : 'Unknown error', '\x1b[0m');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

// Run the script
changeUserRole(); 