import type { Stripe } from "stripe";

import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";

import { currentUser } from "@clerk/nextjs";
import { calculateOverusedSpace, disablePAYG, enablePAYG, getUserById, resetPAYGUsage, transferPAYGUsage, updateSubscription } from "@/actions/aws/users";
import { addToPAYG, cancelPAYG } from "@/actions/stripe";
import { sendSlackMessage } from "@/actions/slack";
import { send } from "process";

export async function POST(req: Request) {
  let event: Stripe.Event;

  const user = await currentUser();

  try {
    event = stripe.webhooks.constructEvent(
      await (await req.blob()).text(),
      req.headers.get("stripe-signature") as string,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    // On error, log and return the error message.
    if (err! instanceof Error) console.log(err);
    console.log(`❌ Error message: ${errorMessage}`);
    return NextResponse.json(
      { message: `Webhook Error: ${errorMessage}` },
      { status: 400 },
    );
  }

  // Successfully constructed event.
  console.log("✅ Success:", event.id);

  const permittedEvents: string[] = [
    "checkout.session.completed",
    "payment_intent.succeeded",
    "payment_intent.payment_failed",
    "customer.subscription.deleted",
    "customer.subscription.updated"
  ];

  if (permittedEvents.includes(event.type)) {
    let data;

    try {
      switch (event.type) {
        case "checkout.session.completed":
          data = event.data.object as Stripe.Checkout.Session;
          console.log(`💰 CheckoutSession status: ${data.payment_status}`);
          console.log(data)

          sendSlackMessage(`New checkout session: ${data?.customer_email}`)

          if(data?.metadata?.payg === "true") {
            await enablePAYG(data?.metadata?.userId, data.customer as string, data.created, data.expires_at)
            sendSlackMessage(`New PAYG customer: ${data?.customer_email}`)
          } else {
            await updateSubscription(data?.metadata?.userId, data.customer as string, data?.metadata?.subscriptionType as string, data.expires_at)
            sendSlackMessage(`New subscription has been created: ${data?.customer_email}, ${data?.metadata?.subscriptionType}`)
          }
          break;
        case "payment_intent.payment_failed":
          data = event.data.object as Stripe.PaymentIntent;
          console.log(`❌ Payment failed: ${data.last_payment_error?.message}`);
          break;
        case "payment_intent.succeeded":
          data = event.data.object as Stripe.PaymentIntent;
          break;
        case "customer.subscription.deleted":
          console.log("Running subscription deleted")
          data = event.data.object as Stripe.Subscription;

          if(data?.metadata?.payg === "true") {
            await disablePAYG(data?.metadata?.userId)
          } else {
            await updateSubscription(data?.metadata?.userId, data.customer as string, "free", data.current_period_end, true)
            // await cancelPAYG(data?.metadata?.userId)
          }

          break;
        
        case "customer.subscription.updated":
          console.log("Running subscription updated")
          data = event.data.object as Stripe.Subscription;

          const user = await getUserById(data?.metadata?.userId)

          if (data?.cancel_at_period_end === true) {
            return;
          }

          // Check if subscription is renewed
          if (!data?.metadata?.payg) {
            await updateSubscription(data?.metadata?.userId, data.customer as string, data?.metadata?.subscriptionType as string, data.current_period_end)
          }

          if(user.PAYGStart < data.current_period_start) {

            // TODO: Update PAYGStart and other start
            if(data?.metadata?.payg === "true") {
              await resetPAYGUsage(data?.metadata?.userId)

              const overusedSpace = await calculateOverusedSpace(user)

              await addToPAYG(data.customer as string, overusedSpace.toString(), user.userid)
              await transferPAYGUsage(user, overusedSpace)
            }
          }
          break;

        default:
          throw new Error(`Unhandled event: ${event.type}`);
      }
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { message: "Webhook handler failed" },
        { status: 500 },
      );
    }
  }
  // Return a response to acknowledge receipt of the event.
  return NextResponse.json({ message: "Received" }, { status: 200 });
}