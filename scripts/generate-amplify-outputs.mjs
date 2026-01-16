import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const region = process.env.VITE_AWS_REGION;
const userPoolId = process.env.VITE_USER_POOL_ID;
const userPoolClientId = process.env.VITE_USER_POOL_CLIENT_ID;
const identityPoolId = process.env.VITE_IDENTITY_POOL_ID;

if (!region || !userPoolId || !userPoolClientId) {
  console.log(
    'Skipping amplify_outputs.json generation: missing VITE_AWS_REGION, VITE_USER_POOL_ID, or VITE_USER_POOL_CLIENT_ID.',
  );
  process.exit(0);
}

const outputs = {
  Auth: {
    Cognito: {
      region,
      userPoolId,
      userPoolClientId,
      identityPoolId: identityPoolId || undefined,
    },
  },
};

const outputPath = resolve(process.cwd(), 'amplify_outputs.json');
writeFileSync(outputPath, JSON.stringify(outputs, null, 2));
console.log('Generated amplify_outputs.json for hosting build.');
