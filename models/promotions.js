const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
const Schema = mongoose.Schema;
const Currency = mongoose.Types.Currency;


const Promotionschema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    label: {
        type: Currency,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        required: true
    },

}, {
    timestamps: true,
}, );

const Promotion = mongoose.model('promotion', Promotionschema);

module.exports = Promotion;