import mongoose, { Schema } from "mongoose";
import slugify from "slugify";

// Event schema for NGO programs and campaigns
const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    eventDate: { type: Date, required: true },
}, { _id: false });

// Project schema for NGO initiatives
const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    targetAmount: { type: Number },
    raisedAmount: { type: Number, default: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String, enum: ['active', 'completed', 'paused'], default: 'active' },
}, { _id: false });

const organizationDetailsSchema = new Schema({
    organizationName: {
        type: String,
        required: [true, "Organization name is required"],
        trim: true,
    },

    slug: {
        type: String,
        unique: true,
        lowercase: true,
    },

    coverImage: {
        type: String, // URL to cover image
        default: "",
    },
    
    ngoType: {
        type: String,
        enum: ['Education', 'Healthcare', 'Disaster Relief', 'Environment', 'Animal Welfare', 'Community Development', 'Human Rights', 'Other'],
        required: true,
    },

    location: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, default: "Global" },
    },

    activitiesAndServices: {
        type: [String],
        default: [],
    },

    operatingHours: {
        weekdays: { type: String },  
        weekends: { type: String }, 
    },

    activeProjects: {
        type: [projectSchema],
        default: [],
    },

    upcomingEvents: {
        type: [eventSchema],
        default: [],
    },

    photoGallery: {
        type: [String], // Array of image URLs
        default: [],
    },

    description: {
        type: String,
        maxlength: 500,
        required: [true, "Organization description is required"],
    },

    mission: {
        type: String,
        maxlength: 1000,
        required: [true, "Organization mission is required"],
    },

    impactStats: {
        beneficiariesServed: { type: Number, default: 0 },
        projectsCompleted: { type: Number, default: 0 },
        volunteersEngaged: { type: Number, default: 0 },
    },

    contactDetails: {
        phone: { type: String },
        email: { type: String },
        facebook: { type: String },
        instagram: { type: String },
        twitter: { type: String },
        linkedin: { type: String },
        website: { type: String },
    },
    
    registrationNumber: {
        type: String,
        unique: true,
        sparse: true,
    },

    isVerified: {
        type: Boolean,
        default: false,
    },

    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },

    verificationRemarks: {
        type: String,
        default: "",
    },

    registeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true,
    },
}, {
    timestamps: true,
});

// Generate slug from organization name
organizationDetailsSchema.pre("save", function (next) {
    if (this.isModified("organizationName") || this.isModified("location.city")) {
        if (!this.organizationName || !this.location.city) {
            return next(new Error("Organization name and city are required to generate a slug."));
        }
        this.slug = slugify(`${this.organizationName}-${this.location.city}`, { lower: true});
    }
    next();
});

export const Organization = mongoose.model("Organization", organizationDetailsSchema);
