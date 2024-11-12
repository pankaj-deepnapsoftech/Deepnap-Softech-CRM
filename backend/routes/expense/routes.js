const express = require('express');
const { createExpense, editExpense, deleteExpense, expenseDetails, allExpenses } = require('../../controllers/expense/controller');
const { createExpenseValidator, validateHandler, editExpenseValidator, deleteExpenseValidator, expenseDetailsValidator } = require('../../validators/expense/validator');
const router = express.Router();

router.post("/create-expense", createExpenseValidator(), validateHandler, createExpense);
router.post("/edit-expense", editExpenseValidator(), validateHandler, editExpense);
router.post("/delete-expense", deleteExpenseValidator(), validateHandler, deleteExpense);
router.post("/expense-details", expenseDetailsValidator(), validateHandler, expenseDetails);
router.post("/all-expenses", allExpenses);

module.exports = router;