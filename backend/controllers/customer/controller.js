const { TryCatch, ErrorHandler } = require("../../helpers/error");
const peopleModel = require("../../models/people");
const customerModel = require("../../models/customer");
const companyModel = require("../../models/company");

const createCustomer = TryCatch(async (req, res) => {
  const { type, peopleId, companyId } = req.body;

  if (peopleId) {
    const isExistingPeople = await peopleModel.findById(peopleId);

    if (!isExistingPeople) {
      throw new ErrorHandler("Person doesn't exist", 404);
    }

    const isCustomerExists = await customerModel.findOne({
      people: peopleId,
    });

    if (isCustomerExists) {
      throw new ErrorHandler("Customer already exists", 400);
    }

    const customer = await customerModel.create({
      creator: req.user.id,
      customertype: type,
      people: peopleId,
    });

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Customer has been created successfully",
      customer: customer,
    });
  } else if (companyId) {
    const isExistingCompany = await companyModel.findById(companyId);

    if (!isExistingCompany) {
      throw new ErrorHandler("Company doesn't exist", 404);
    }

    const isCustomerExists = await companyModel.findOne({
      _id: companyId,
    });

    if (!isCustomerExists) {
      throw new ErrorHandler("Customer already exists", 400);
    }

    const customer = await customerModel.create({
      customertype: type,
      company: companyId,
      creator: req.user.id,
    });

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Customer has been created successfully",
      customer: customer,
    });
  }

  throw new ErrorHandler("People or Company must be specified", 400);
});

const editCustomer = TryCatch(async (req, res) => {
  const { customerId, status } = req.body;
  const isCustomerExists = await customerModel.findById(customerId);

  if (!isCustomerExists) {
    throw new ErrorHandler("Customer doesn't exists", 400);
  }

  if (
    req.user.role !== "Super Admin" &&
    isCustomerExists.creator.toString() !== req.user.id.toString()
  ) {
    throw new Error("You are not allowed to edit this customer", 401);
  }

  const customer = await customerModel.findOneAndUpdate(
    { _id: customerId },
    { status },
    { new: true }
  );

  return res.status(200).json({
    status: 200,
    success: true,
    message: "Customer has been updated successfully",
    customer: customer,
  });
});

const deleteCustomer = TryCatch(async (req, res) => {
  const { customerId } = req.body;

  const isCustomerExists = await customerModel.findById(customerId);

  if (!isCustomerExists) {
    throw new ErrorHandler("Customer doesn't exists", 400);
  }

  if (
    req.user.role !== "Super Admin" &&
    isCustomerExists.creator.toString() !== req.user.id.toString()
  ) {
    throw new Error("You are not allowed to delete this customer", 401);
  }

  const deletedCustomer = await customerModel.deleteOne({ _id: customerId });

  res.status(200).json({
    status: 200,
    success: true,
    message: "Customer has been deleted successfully",
    deletedCustomer: deletedCustomer,
  });
});

const customerDetails = TryCatch(async (req, res) => {
  const { customerId } = req.body;

  const customer = await customerModel
    .findById(customerId)
    .populate("people", "firstname lastname email phone")
    .populate("company", "companyname email phone")
    .populate({
      path: "products",
      populate: [
        {
          path: "category",
          model: "Product Category",
          select: "categoryname",
        },
      ],
    });

  if (!customer) {
    throw new ErrorHandler("Customer doesn't exists", 400);
  }

  if (
    req.user.role !== "Super Admin" &&
    customer.creator.toString() !== req.user.id.toString()
  ) {
    throw new Error("You are not allowed to access this customer", 401);
  }

  res.status(200).json({
    status: 200,
    success: true,
    customer: {
      _id: customer._id,
      name:
        customer.people !== undefined
          ? customer.people.firstname + customer.people.lastname
          : customer.company.companyname,
      email:
        customer.people !== undefined
          ? customer.people.email
          : customer.company.email,
      phone:
        customer.people !== undefined
          ? customer.people.phone
          : customer.company.phone,
      customertype: customer.customertype,
      status: customer.status,
      products: customer.products,
    },
  });
});

const allCustomers = TryCatch(async (req, res) => {
  const { page = 1 } = req.body;

  let customers = [];

  if (req.user.role === "Super Admin") {
    customers = await customerModel
      .find()
      .sort({ createdAt: -1 })
      .populate("people", "firstname lastname email phone")
      .populate("company", "companyname email phone")
      .populate("creator", "name");
  } else {
    customers = await customerModel
      .find({ creator: req.user.id })
      .sort({ createdAt: -1 })
      .populate("people", "firstname lastname email phone")
      .populate("company", "companyname email phone")
      .populate("creator", "name");
  }

  const results = customers.map((customer) => {
    return {
      _id: customer._id,
      name:
        customer.people !== undefined
          ? customer.people?.firstname + " " + customer.people?.lastname
          : customer.company?.companyname,
      email:
        customer.people !== undefined
          ? customer.people?.email
          : customer.company?.email,
      phone:
        customer.people !== undefined
          ? customer.people?.phone
          : customer.company?.phone,
      customertype: customer?.customertype,
      status: customer?.status,
      creator: customer?.creator.name,
      createdAt: customer?.createdAt,
    };
  });

  res.status(200).json({
    status: 200,
    success: true,
    customers: results,
  });
});

module.exports = {
  createCustomer,
  editCustomer,
  deleteCustomer,
  allCustomers,
  customerDetails,
};
