const { spawn } = require('child_process');

console.log('Generating database migration...');

const child = spawn('npx', ['drizzle-kit', 'generate'], {
  stdio: 'pipe',
  shell: true
});

// Send "create table" responses for the prompts
setTimeout(() => {
  child.stdin.write('+\n');
}, 1000);

setTimeout(() => {
  child.stdin.write('+\n');
}, 2000);

child.stdout.on('data', (data) => {
  console.log(data.toString());
});

child.stderr.on('data', (data) => {
  console.log(data.toString());
});

child.on('close', (code) => {
  console.log(`Migration generation completed with code ${code}`);
  process.exit(code);
});
