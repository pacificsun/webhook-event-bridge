// import Strpe from 'stripe';
// const stripe = new Strpe(process.env.STRIPE_SECRET_KEY);
const stripe = require('stripe');
module.exports.stripeWebhook = async (event) => {
  console.log('event in handler>>', event);
  let err = null;
  try {
    const signature = event.headers['Stripe-Signature'];
    console.log('signature>>', signature);
    const secret = process.env.STRIPE_WEBHOOKS_SECRET_KEY;
    console.log('secret>>', secret);
    console.log('event.body>>', event.body);
    console.log('event.headers>>', event.headers);
    const eventReceived = stripe.webhooks.constructEvent(
      event.body,
      signature,
      secret
    );
    console.log('eventRecevied>>', eventReceived);
    // await eventbridge.sendToEventBridge(
    //   process.env.EVENT_BRIheaheadersdersheadersDGE,
    //   eventReceived
    // );
  } catch (e) {
    console.error(e);
  }
  const body = err ? JSON.stringify(err) : '';
  const statusCode = err ? 500 : 200;
  console.log('body and statusCode>>', body + '' + statusCode);
  return { statusCode, body };
};
