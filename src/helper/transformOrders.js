import axios from "axios";

const transformOrders = (lineItems, email)  => {
    const ordersArray = [];
    lineItems.data.forEach(async (item) => {
      for (let i = 0; i < item.quantity; i++) {
        const order = {
          projectName: item.description,
          email: email,
          price: item.price.unit_amount / 100,
        };
          
        await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}projects/addNewProject`, order)
        ordersArray.push(order);
      }
    });
}

export default transformOrders;