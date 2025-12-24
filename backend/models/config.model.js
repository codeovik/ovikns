// f:\ovikns\backend\models\config.model.js
import mongoose from "mongoose";

const configSchema = new mongoose.Schema({
    freeShippingThreshold: {
        type: Number,
        default: 400,
        required: true
    },
    shippingFee: {
        type: Number,
        default: 50,
        required: true
    }
}, { timestamps: true });

const Config = mongoose.model("Config", configSchema);

export default Config;