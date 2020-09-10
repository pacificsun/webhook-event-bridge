'use strict';
const stripe = require('stripe'),
  eventbridge = require('./lib/eventbridge'),
  sns = require('./lib/sns'),
  AWS = require('aws-sdk'),
  { promisify } = require('util'),
  secretName = process.env.ENDPOINT_SECRET;

var client = new AWS.SecretsManager();
client.fetchSecret = promisify(client.getSecretValue);

module.exports.stripeWebhook = async (event) => {
  console.log('event in handler>>', event);
  let err = null;
  try {
    const signature = event.headers['Stripe-Signature'];
    console.log('signature>>', signature);
    const secret = (await client.fetchSecret({ SecretId: secretName }))
      .SecretString;
    console.log('secret>>', secret);
    const eventReceived = stripe.webhooks.constructEvent(
      event.body,
      signature,
      secret
    );
    console.log('eventRecevied>>', eventReceived);
    await eventbridge.sendToEventBridge(
      process.env.EVENT_BRIDGE,
      eventReceived
    );
  } catch (e) {
    err = e;
    await sns.notifyFailure(e.message);
  }
  const body = err ? JSON.stringify(err) : '';
  const statusCode = err ? 500 : 200;
  console.log('body and statusCode>>', body + '' + statusCode);
  return { statusCode, body };
};
