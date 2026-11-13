const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },

    age: {
         type: Number,
        required: [true, "Age is required"],
        min: [18, "User must be at least 18 years old"]
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);