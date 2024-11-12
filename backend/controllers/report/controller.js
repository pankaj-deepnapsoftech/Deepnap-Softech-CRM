const { TryCatch } = require("../../helpers/error");
const paymentModel = require("../../models/payment");
const expenseModel = require("../../models/expense");
const mongoose = require('mongoose');

const getPaymentReport = TryCatch(async (req, res) => {
  const { from, to } = req.body;

  if(!from || !to){
    throw new Error('Missing required date fields', 400);
  }

  const query = {};
  if(req.user.role !== 'Super Admin'){
    query.creator =  new mongoose.Types.ObjectId(req.user.id);
  }

  const payments = await paymentModel.aggregate([
    {
      $match: {
        updatedAt: {
            $gte: new Date(from),
            $lte: new Date(to)
        },
        // creator: query?.creator || { $exists: true }
        ...query
      },
    },
    {
      $project: {
        amount: 1,
        month: { $dateToString: { format: "%m", date: "$createdAt" } },
      },
    },
    {
      $group: {
        _id: "$month",
        total_amount: {
          $sum: "$amount",
        },
      },
    },
  ]);

  res.status(200).json({
    status: 200,
    success: true,
    payments,
  });
});

const getExpenseReport = TryCatch(async (req, res) => {
  const { from, to } = req.body;

  if(!from || !to){
    throw new Error('Missing required date fields', 400);
  }

  const query = {};
  if(req.user.role !== 'Super Admin'){
    query.creator =  new mongoose.Types.ObjectId(req.user.id);
  }

  const expenses = await expenseModel.aggregate([
    {
      $match: {
        updatedAt: {
            $gte: new Date(from),
            $lte: new Date(to)
        },
        // creator: query?.creator || { $exists: true }
        ...query
      },
    },
    {
      $project: {
        price: {
            $convert: {
                input: '$price',
                to: 'int'
            }
        },
        month: { $dateToString: { format: "%m", date: "$createdAt" } },
      },
    },
    {
      $group: {
        _id: "$month",
        total_amount: {
          $sum: "$price",
        },
      },
    },
  ]);

  res.status(200).json({
    status: 200,
    success: true,
    expenses,
  });
});

module.exports = {
  getPaymentReport,
  getExpenseReport
};
