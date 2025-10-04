const { spawn } = require('child_process');
const readline = require('readline');

const child = spawn('npx', ['drizzle-kit', 'push'], {
  stdio: ['pipe', 'inherit', 'inherit'],
  shell: true
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

child.stdout?.on('data', (data) => {
  const output = data.toString();
  console.log(output);
  
  if (output.includes('create enum') || output.includes('create table')) {
    child.stdin?.write('0\n');
  }
});

child.on('close', (code) => {
  console.log(`Migration process exited with code ${code}`);
  process.exit(code);
});
