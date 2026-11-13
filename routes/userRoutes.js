const express = require("express");
const User = require("../models/userModel");

const router = express.Router();

// CREATE USER
router.post("/", async (req, res) => {
    try {
        const user = await User.create(req.body);

        res.status(201).json({
            success: true,
            data: user
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// UPDATE USER
router.put("/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        const statusCode = error.name === "ValidationError" || error.name === "CastError" || error.code === 11000
            ? 400
            : 500;

        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
});

// GET ALL USERS
/*
router.get("/", async (req, res) => {
    try {
        const users = await User.find();

        res.status(200).json({
            success: true,
            data: users
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
*/

// GET USER BY ID

router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        const statusCode = error.name === "CastError" ? 400 : 500;

        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
});



// DELETE MULTIPLE USERS
router.delete("/bulk", async (req, res) => {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0 || ids.some(id => typeof id !== "string" || !/^[a-f\d]{24}$/i.test(id))) {
        return res.status(400).json({
            success: false,
            message: "Provide a non-empty ids array containing valid user IDs"
        });
    }

    try {
        const result = await User.deleteMany({ _id: { $in: ids } });

        res.status(200).json({
            success: true,
            message: `${result.deletedCount} users deleted successfully`,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// DELETE USER
router.delete("/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}); 
// CREATE MULTIPLE USERS
router.post("/bulk", async (req, res) => {
    try {
        const users = await User.insertMany(req.body);

        res.status(201).json({
            success: true,
            message: `${users.length} users created successfully`,
            data: users
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});



// GET ALL USERS (5 USERS PER PAGE)
router.get("/", async (req, res) => {
    try {
        // Get page number from URL
        const page = Number(req.query.page ?? 1);

        // Validate page number
        if (!Number.isInteger(page) || page < 1) {
            return res.status(400).json({
                success: false,
                message: "Page must be a positive integer"
            });
        }

        // Number of users per page
        const limit = 5;

        // Calculate how many users to skip
        const usersToSkip = (page - 1) * limit;

        // Fetch users
        const users = await User.find()
            .skip(usersToSkip)
            .limit(limit)
            .sort({ createdAt: -1 });

        // Get total number of users
        const totalUsers = await User.countDocuments();

        // Calculate total pages
        const totalPages = Math.ceil(totalUsers / limit);

        // Send response
        res.status(200).json({
            success: true,
            currentPage: page,
            totalPages,
            totalUsers,
            usersPerPage: limit,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
            data: users
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;