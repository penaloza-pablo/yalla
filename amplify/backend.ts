import { defineBackend } from '@aws-amplify/backend';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { getInventory } from './functions/get-inventory/resource';
import { upsertInventory } from './functions/upsert-inventory/resource';
import { getAlerts } from './functions/get-alerts/resource';
import { updateAlertStatus } from './functions/update-alert-status/resource';

export const backend = defineBackend({
  auth,
  data,
  getInventory,
  upsertInventory,
  getAlerts,
  updateAlertStatus,
});

const inventoryTableArn =
  'arn:aws:dynamodb:eu-central-1:471112597523:table/yalla-inventory';
const alertsTableArn =
  'arn:aws:dynamodb:eu-central-1:471112597523:table/yalla-alarms';

backend.getInventory.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['dynamodb:Scan', 'dynamodb:Query'],
    resources: [inventoryTableArn, `${inventoryTableArn}/index/*`],
  }),
);

backend.upsertInventory.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['dynamodb:PutItem', 'dynamodb:UpdateItem'],
    resources: [inventoryTableArn, `${inventoryTableArn}/index/*`],
  }),
);

backend.getAlerts.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['dynamodb:Scan', 'dynamodb:Query', 'dynamodb:UpdateItem'],
    resources: [alertsTableArn, `${alertsTableArn}/index/*`],
  }),
);

backend.updateAlertStatus.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['dynamodb:UpdateItem'],
    resources: [alertsTableArn, `${alertsTableArn}/index/*`],
  }),
);