const { TryCatch } = require("../../helpers/error");
const { emitEvent } = require("../../helpers/socket");
const adminModel = require("../../models/admin");
const notificationModel = require("../../models/notification");
const supportModel = require("../../models/support");

const createSupport = TryCatch(async (req, res) => {
  const { name, mobile, purpose, description } = req.body;

  const support = await supportModel.create({
    name,
    purpose,
    mobile,
    description,
  });

  const superAdmin = await adminModel.find({ role: "Super Admin" });
  const receivers = superAdmin.map((admin) => ({email: admin.email}));

  await notificationModel.create({
    author: superAdmin[0]._id,
    message: `${name}'s lead has been assigned to you`,
  });

  emitEvent(
    req,
    "NEW_SUPPORT_QUERY",
    receivers,
    `${name}'s lead has been assigned to you`
  );

  res.status(200).json({
    status: 200,
    success: true,
    message: "Your request has been submitted successfully",
  });
});

const deleteSupport = TryCatch(async (req, res) => {
  const { supportId } = req.body;

  const isExistingSupport = await supportModel.findById(supportId);
  if (!isExistingSupport) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: "Support doesn't exist",
    });
  }

  if (
    req.user.role !== "Super Admin" &&
    isExistingSupport?.assigned &&
    isExistingSupport?.assigned?.toString() !== req.user.id.toString()
  ) {
    return res.status(401).json({
      status: 401,
      success: false,
      message: "You are not authorized to access this route",
    });
  }

  await supportModel.deleteOne({ _id: supportId });

  res.status(200).json({
    status: 200,
    success: true,
    message: "Support has been deleted successfully",
  });
});

const editSupport = TryCatch(async (req, res) => {
  let { supportId, assigned, status, remarks } = req.body;

  const isExistingSupport = await supportModel.findById(supportId);
  if (!isExistingSupport) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: "Support doesn't exist",
    });
  }
  if (status.toLowerCase() === "assigned" && !assigned) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Please provide the assigned field",
    });
  }

  status = status.toLowerCase();

  if (
    req.user.role !== "Super Admin" &&
    isExistingSupport?.assigned &&
    isExistingSupport?.assigned?.toString() !== req.user.id.toString()
  ) {
    return res.status(401).json({
      status: 401,
      success: false,
      message: "You are not authorized to access this route",
    });
  }

  const support = await supportModel.findById(supportId);

  support.remarks = remarks;
  support.assigned = assigned;
  support.status = status;
  
  await support.save();

  const receiver = await adminModel.findById(assigned);

  if(status.toLowerCase() === 'assigned'){
    await notificationModel.create({
      author: assigned,
      message: `${support.name}'s lead has been assigned to you`,
    });

    emitEvent(
      req,
      "NEW_SUPPORT_QUERY",
      [{email: receiver?.email}],
      `${support.name}'s lead has been assigned to you`
    );
  }

  res.status(200).json({
    status: 200,
    success: true,
    message: "Support has been updated successfully",
  });
});

const getSupportDetails = TryCatch(async (req, res) => {
  const { supportId } = req.body;

  const support = await supportModel
    .findOne({ _id: supportId })
    .populate("assigned", "name email phone");

  if (!support) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Support doesn't exist",
    });
  }

  res.status(200).json({
    status: 200,
    success: true,
    support,
  });
});

const getAllSupport = TryCatch(async (req, res) => {
  const support = await supportModel
    .find({})
    .populate("assigned", "name email phone");

  res.status(200).json({
    status: 200,
    success: true,
    support,
  });
});

const getAllAssignedSupport = TryCatch(async (req, res) => {
  let support;
  if (req.user.role === "Super Admin") {
    support = await supportModel
      .find({ status: "assigned" })
      .populate("assigned", "name email phone");
  } else {
    support = await supportModel
      .find({
        status: "assigned",
        $or: [{ creator: req.user.id }, { assigned: req.user.id }],
      })
      .populate("assigned", "name email phone");
  }

  res.status(200).json({
    status: 200,
    success: true,
    support,
  });
});

module.exports = {
  createSupport,
  deleteSupport,
  editSupport,
  getSupportDetails,
  getAllSupport,
  getAllAssignedSupport,
};
