const mongoose = require('mongoose');

const websiteConfigurationSchema = mongoose.Schema({
    creator: {
        type: mongoose.Types.ObjectId,
        ref: "Admin",
        required: [true, "creator is a required field"],
    },
    indiamart_api: {
        type: String
    },
    facebook_api: {
        type: String
    }
}, {
    timestamps: true
});

const websiteConfigurationModel = mongoose.model('Website Configuration', websiteConfigurationSchema);

module.exports = websiteConfigurationModel;