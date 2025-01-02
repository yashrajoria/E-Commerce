const { Order } = require("@/models/Order");

export const getOrders = async (email) => {
  return Order.aggregate([
    {
      $match: {
        email: email,
      },
    },
    {
      $project: {
        order_data: {
          $map: {
            input: "$line_items",
            as: "item",
            in: {
              quantity: "$$item.quantity",
              name: "$$item.price_data.product_data.name",
              price: {
                $divide: ["$$item.price_data.unit_amount", 100],
              },
              total: {
                $multiply: [
                  {
                    $divide: ["$$item.price_data.unit_amount", 100],
                  },
                  "$$item.quantity",
                ],
              },
            },
          },
        },
        createdAt: 1,
        paid: 1,
        status: 1,
      },
    },
    {
      $addFields: {
        totalAmount: {
          $sum: "$order_data.total",
        },
        currency: {
          $first: "$line_items.price_data.currency",
        },
      },
    },
    {
      $project: {
        order_data: {
          $map: {
            input: "$order_data",
            as: "item",
            in: {
              quantity: "$$item.quantity",
              name: "$$item.name",
              price: "$$item.price",
            },
          },
        },
        // createdAt: {
        //   $dateToString: {
        //     format: "%d-%m-%Y",
        //     date: "$createdAt",
        //   },
        // },
        createdAt: 1,
        amount: {
          $concat: [
            {
              $toString: "$totalAmount",
            },
            " ",
            {
              $ifNull: ["$currency", "INR"],
            },
          ],
        },
        paid: {
          $cond: {
            if: "$paid",
            then: "Yes",
            else: "No",
          },
        },
        status: 1,
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);
};
