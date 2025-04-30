// Script to update browserslist database using ESM syntax
import { execSync } from 'child_process';

console.log('Updating caniuse-lite database...');

try {
  // Use npm instead of bun to update caniuse-lite
  execSync('npm update caniuse-lite --no-save', { stdio: 'inherit' });
  console.log('Successfully updated caniuse-lite!');
} catch (error) {
  console.error('Error updating caniuse-lite:', error.message);
  process.exit(1);
} 