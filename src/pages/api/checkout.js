import { stripe } from "../../lib/stripe";

export default async (req, res) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    process.env.NEXT_PUBLIC_CLIENT_URL
  );
  if (req.method === "POST") {
    const data = await req.body;

    const userOrders = {};
    data.forEach((order) => {
      const userId = order.userDetails.id;
      if (!userOrders[userId]) {
        userOrders[userId] = [];
      }
      userOrders[userId].push(order);
    });

    const transformedData = Object.values(userOrders).map((orders) => {
      const userDetails = orders[0].userDetails;
      const services = orders.flatMap((order) => {
        return order.bundles.map((bundle) => {
          return {
            serviceName: `${order.serviceName} - ${bundle.name}`,
            price: bundle.price,
            quantity: bundle.quantity,
          };
        });
      });

      return {
        userDetails,
        services,
      };
    });

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        client_reference_id: transformedData[0].userDetails.id,
        customer_email: transformedData[0].userDetails.email,
       
        line_items: transformedData.flatMap((order) => {
          return order.services.map((service) => {
            return {
              price_data: {
                currency: "usd",
                product_data: {
                  name: service.serviceName,
                },
                unit_amount: service.price * 100,
              },
              quantity: service.quantity,
            };
          });
        }),
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_CLIENT_URL}/cart-checkout?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_CLIENT_URL}/cart-checkout?success=false`,
      });
      res.send({
        url: session.url,
        sessionId: session.id,
      });
      return;
    } catch (error) {
      res.status(500).json({ error: "Failed to checkout" });
    }
  } else {
    console.log("Method not allowed");
    console.log(req);
  }
};
