const mongoose = require("mongoose");
const customerModel = require("./customer");
const proformaInvoiceModel = require("./proformaInvoice");
const invoiceModel = require("./invoice");
const leadModel = require("./lead");

const peopleSchema = mongoose.Schema(
  {
    creator: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
      required: [true, "creator is a required field"],
    },
    firstname: {
      type: String,
      required: [true, "firstname is a required field"],
    },
    lastname: {
      type: String,
      required: [true, "lastname is a required field"],
    },
    email: {
      type: String,
      required: [true, "email is a required field"],
    },
    phone: {
      type: String,
      required: [true, "phone is a required field"],
    },
    // company: {
    //   type: mongoose.Types.ObjectId,
    //   ref: "Company"
    // },
  },
  { timestamps: true }
);

peopleSchema.pre(
  "create",
  { document: true, query: true },
  async function (next) {
    const docToCreate = await this.model.create(this.getQuery(), {
      ignoreUndefined: true,
    });
    next();
  }
);

peopleSchema.pre(
  "deleteOne",
  { document: true, query: true },
  async function (next) {
    const docToDelete = await this.model.findOne(this.getQuery());
    if (docToDelete?._id !== undefined) {
      await customerModel.deleteMany({ people: docToDelete._id });
      await proformaInvoiceModel.deleteMany({ people: docToDelete._id });
      await leadModel.deleteMany({ people: docToDelete._id });
    }
    next();
  }
);

peopleSchema.pre(
  "deleteMany",
  { document: true, query: true },
  async function (next) {
    const docToDelete = await this.model.findOne(this.getQuery());
    if (docToDelete?._id !== undefined) {
      await customerModel.deleteMany({ people: docToDelete._id });
      await proformaInvoiceModel.deleteMany({ people: docToDelete._id });
      await leadModel.deleteMany({ people: docToDelete._id });
    }
    next();
  }
);

const peopleModel = mongoose.model("People", peopleSchema);

module.exports = peopleModel;
