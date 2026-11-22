const express = require("express");
const router = express.Router();
const Lead = require("../models/lead");
// GET all leads (with search and status filter)

 
// GET all leads (search and status filter)
router.get("/", async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    if (status && status !== "All") {
      query.status = status;
    }

    const leads = await Lead.find(query).sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leads" });
  }
});

// GET single lead
router.get("/:id", async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json(lead);
  } catch (error) {
    res.status(400).json({ message: "Invalid lead ID" });
  }
});

// CREATE lead

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, company, source, status } = req.body;

    if (
      !name?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !company?.trim() ||
      !source
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    const lead = await Lead.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      company: company.trim(),
      source,
      status: status || "New",
    });

    res.status(201).json(lead);
  } catch (error) {
    res.status(400).json({
      message: error.message || "Failed to create lead",
    });
  }
});


// UPDATE lead
router.put("/:id", async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json(lead);
  } catch (error) {
    res.status(400).json({
      message: error.message || "Failed to update lead",
    });
  }
});

// DELETE lead
router.delete("/:id", async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json({ message: "Lead deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid lead ID" });
  }
});

module.exports = router;
