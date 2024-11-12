const { TryCatch } = require("../../helpers/error");
const websiteConfigurationModel = require("../../models/websiteConfiguration");

const getFacebookApi = TryCatch(async (req, res) => {
  if (req.user.role !== "Super Admin") {
    return res.status(401).json({
      status: 401,
      success: false,
      message: "You are not authorized to access this route",
    });
  }

  const websiteCofiguration = await websiteConfigurationModel.findOne({
    creator: req.user.id,
  });
  if (!websiteCofiguration) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Website configuration not found",
    });
  }

  res.status(200).json({
    status: 200,
    success: true,
    facebookApi: websiteCofiguration.facebook_api,
  });
});

const getIndiamartApi = TryCatch(async (req, res) => {
  if (req.user.role !== "Super Admin") {
    return res.status(401).json({
      status: 401,
      success: false,
      message: "You are not authorized to access this route",
    });
  }

  const websiteCofiguration = await websiteConfigurationModel.findOne({
    creator: req.user.id,
  });
  if (!websiteCofiguration) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Website configuration not found",
    });
  }

  res.status(200).json({
    status: 200,
    success: true,
    indiamartApi: websiteCofiguration.indiamart_api,
  });
});

const updateFacebookApi = TryCatch(async (req, res) => {
  if (req.user.role !== "Super Admin") {
    return res.status(401).json({
      status: 401,
      success: false,
      message: "You are not authorized to access this route",
    });
  }

  const {facebookApi} = req.body;
  if(!facebookApi){
    return res.status(400).json({
        status: 400,
        success: false,
        message: "Facebook API not provided"
    })
  }

  const websiteCofiguration = await websiteConfigurationModel.findOne({
    creator: req.user.id,
  });
  if (!websiteCofiguration) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Website configuration not found",
    });
  }

  await websiteConfigurationModel.updateOne({creator: req.user.id}, {facebook_api: facebookApi});

  res.status(200).json({
    status: 200,
    success: true,
    message: "Facebook API has been updated successfully"
  });
});

const updateIndiamartApi = TryCatch(async (req, res) => {
  if (req.user.role !== "Super Admin") {
    return res.status(401).json({
      status: 401,
      success: false,
      message: "You are not authorized to access this route",
    });
  }

  const {indiamartApi} = req.body;
  if(!indiamartApi){
    return res.status(400).json({
        status: 400,
        success: false,
        message: "Indiamart API not provided"
    })
  }

  const websiteCofiguration = await websiteConfigurationModel.findOne({
    creator: req.user.id,
  });
  if (!websiteCofiguration) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Website configuration not found",
    });
  }

  await websiteConfigurationModel.updateOne({creator: req.user.id}, {indiamart_api: indiamartApi});

  res.status(200).json({
    status: 200,
    success: true,
    message: "Facebook API has been updated successfully"
  });
});

module.exports = {
  getFacebookApi,
  getIndiamartApi,
  updateFacebookApi,
  updateIndiamartApi
};
