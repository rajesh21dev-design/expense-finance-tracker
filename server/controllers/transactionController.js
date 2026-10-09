import Transaction from "../models/Transaction.js";

export const createTransaction = async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;

    if (!type || amount === undefined || !category) {
      return res.status(400).json({
        message: "Type, amount and category are required",
      });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({
        message: "Type must be income or expense",
      });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than 0",
      });
    }

    const transaction = await Transaction.create({
      user: req.user.userId,
      type,
      amount: Number(amount),
      category,
      description,
      date: date || new Date(),
    });

    res.status(201).json({
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.userId,
    }).sort({ date: -1 });

    res.json({
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.json({
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;

    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    if (type !== undefined) {
      if (!["income", "expense"].includes(type)) {
        return res.status(400).json({
          message: "Type must be income or expense",
        });
      }

      transaction.type = type;
    }

    if (amount !== undefined) {
      if (Number(amount) <= 0) {
        return res.status(400).json({
          message: "Amount must be greater than 0",
        });
      }

      transaction.amount = Number(amount);
    }

    if (category !== undefined) {
      transaction.category = category;
    }

    if (description !== undefined) {
      transaction.description = description;
    }

    if (date !== undefined) {
      transaction.date = date;
    }

    await transaction.save();

    res.json({
      message: "Transaction updated successfully",
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    await transaction.deleteOne();

    res.json({
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};