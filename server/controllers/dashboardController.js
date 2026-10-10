
import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";

export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({
        message: "Invalid user ID",
      });
    }

    const result = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: null,

          totalIncome: {
            $sum: {
              $cond: [
                { $eq: ["$type", "income"] },
                "$amount",
                0,
              ],
            },
          },

          totalExpenses: {
            $sum: {
              $cond: [
                { $eq: ["$type", "expense"] },
                "$amount",
                0,
              ],
            },
          },

          transactionCount: {
            $sum: 1,
          },
        },
      },
    ]);

    const summary = result[0] || {
      totalIncome: 0,
      totalExpenses: 0,
      transactionCount: 0,
    };

    res.json({
      totalIncome: summary.totalIncome,
      totalExpenses: summary.totalExpenses,
      balance: summary.totalIncome - summary.totalExpenses,
      transactionCount: summary.transactionCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch dashboard summary",
    });
  }
};
