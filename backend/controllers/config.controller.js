import Config from "../models/config.model.js";

// Get current configuration
export const getConfig = async (req, res) => {
    try {
        let config = await Config.findOne();
        
        // If no config exists, create a default one
        if (!config) {
            config = await Config.create({ freeShippingThreshold: 400, shippingFee: 50 });
        }

        res.status(200).json({ success: true, config });
    } catch (error) {
        console.error("Error fetching config:", error);
        res.status(500).json({ success: false, message: "Failed to fetch configuration" });
    }
};

// Update configuration
export const updateConfig = async (req, res) => {
    try {
        const { freeShippingThreshold, shippingFee } = req.body;

        // Update the existing config or create if not exists (upsert)
        const config = await Config.findOneAndUpdate(
            {},
            { 
                freeShippingThreshold: Number(freeShippingThreshold), 
                shippingFee: Number(shippingFee) 
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(200).json({ success: true, message: "Configuration updated successfully", config });
    } catch (error) {
        console.error("Error updating config:", error);
        res.status(500).json({ success: false, message: "Failed to update configuration" });
    }
};