const mongoose = require('mongoose');

const settingSchema = mongoose.Schema({
    creator: {
        type: mongoose.Types.ObjectId,
        ref: "Admin"
    },
    company_name: String,
    company_address: String,
    company_state: String,
    company_country: String,
    company_email: String,
    company_phone: String,
    company_website: String,
    company_gst_number: String,
    company_logo: String,
    invoice_pdf_footer: String,
    proforma_invoice_pdf_footer: String,
    offer_pdf_footer: String,
    last_invoice_number: Number,
    last_proforma_invoice_number: Number,
    last_offer_number: Number,
    last_payment_number: Number,
}, {timestamps: true});

const settingModel = mongoose.model('Setting', settingSchema);

module.exports = settingModel;
