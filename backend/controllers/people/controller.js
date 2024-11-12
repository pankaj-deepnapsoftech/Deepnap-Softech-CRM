const { TryCatch, ErrorHandler } = require("../../helpers/error");
const customerModel = require("../../models/customer");
const invoiceModel = require("../../models/invoice");
const leadModel = require("../../models/lead");
const offerModel = require("../../models/offer");
const paymentModel = require("../../models/payment");
const peopleModel = require("../../models/people");
const proformaInvoiceModel = require("../../models/proformaInvoice");

const createPeople = TryCatch(async (req, res) => {
  const { firstname, lastname, email, phone } = req.body;

  let isExistingPeople = await peopleModel.findOne({ email });
  if (isExistingPeople) {
    throw new Error("Person with this email id already exists", 409);
  }

  isExistingPeople = await peopleModel.findOne({ phone });
  if (isExistingPeople) {
    throw new Error("Person with this phone no. already exists", 409);
  }

  const person = await peopleModel.create({
    creator: req.user.id,
    firstname,
    lastname,
    email,
    phone,
  });

  res.status(200).json({
    status: 200,
    success: true,
    message: "Person has been created successfully",
    person: person,
  });
});

const editPeople = TryCatch(async (req, res) => {
  const { peopleId, firstname, lastname, email, phone } = req.body;

  const isExistingPerson = await peopleModel.findById(peopleId);

  if (!isExistingPerson) {
    throw new Error("Person not found", 404);
  }
  if (
    req.user.role !== "Super Admin" &&
    isExistingPerson.creator.toString() !== req.user.id.toString()
  ) {
    throw new Error("You are not allowed to edit this individual", 401);
  }

  const isEmailTaken = await peopleModel.findOne({ email: email });
  if (isEmailTaken && isExistingPerson.email !== email) {
    throw new Error("Email id is already registered with us.");
  }

  const isPhoneTaken = await peopleModel.findOne({ phone: phone });
  if (isPhoneTaken && isExistingPerson.phone !== phone) {
    throw new Error("Phone no. is already registered with us.");
  }

  const updatedPerson = await peopleModel.findOneAndUpdate(
    { _id: peopleId },
    {
      firstname,
      lastname,
      email,
      phone,
    },
    { new: true }
  );

  res.status(200).json({
    status: 200,
    success: true,
    message: "Person's details has been updated successfully",
    updatedPerson: updatedPerson,
  });
});

const deletePeople = TryCatch(async (req, res) => {
  const { peopleId } = req.body;

  const isExistingPeople = await peopleModel.findById(peopleId);

  if (!isExistingPeople) {
    throw new ErrorHandler("Person not found", 404);
  }

  if (
    req.user.role !== "Super Admin" &&
    isExistingPeople.creator.toString() !== req.user.id.toString()
  ) {
    throw new Error("You are not allowed to delete this individual", 401);
  }

  const deletedPerson = await peopleModel.deleteOne({ _id: peopleId });

  res.status(200).json({
    status: 200,
    success: true,
    message: "Person has been deleted successfully",
    deletedPerson: deletedPerson,
  });
});

const personDetails = TryCatch(async (req, res) => {
  const { peopleId } = req.body;

  let person = await peopleModel.findById(peopleId);
  if (!person) {
    throw new ErrorHandler("Person doesn't exists", 400);
  }

  if (
    req.user.role !== "Super Admin" &&
    person.creator.toString() !== req.user.id.toString()
  ) {
    throw new Error("You are not allowed to access this individual", 401);
  }

  person = {
    _id: person._id,
    firstname: person.firstname,
    lastname: person.lastname,
    email: person.email,
    phone: person.phone
  };

  res.status(200).json({
    status: 200,
    success: true,
    person: person,
  });
});

const allPersons = TryCatch(async (req, res) => {
  let people = [];

  if (req.user.role === "Super Admin") {
    people = await peopleModel
      .find()
      .sort({ createdAt: -1 })
      .populate("creator", "name");
  } else {
    people = await peopleModel
      .find({ creator: req.user.id })
      .sort({ createdAt: -1 })
      .populate("creator", "name");
  }

  const results = people.map((p) => {
    return {
      _id: p._id,
      firstname: p.firstname,
      lastname: p.lastname,
      phone: p.phone,
      email: p.email,
      creator: p.creator.name,
      createdAt: p.createdAt,
    };
  });

  res.status(200).json({
    status: 200,
    success: true,
    people: results,
  });
});

module.exports = {
  createPeople,
  editPeople,
  deletePeople,
  personDetails,
  allPersons,
};
