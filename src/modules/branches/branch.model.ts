import mongoose, { Schema, Document } from 'mongoose';

// Define the TypeScript interface for Branch
export interface IBranch extends Document {
    name: string;
    type: 'COMPANY_OWNED' | 'FRANCHISE' | 'WAREHOUSE';
    location: string;
    isActive: boolean;
}

// Define the Mongoose schema for Branch
const branchSchema = new Schema<IBranch>(
    {
        name: { type: String, required: true },
        type: {
            type: String,
            enum: ['COMPANY_OWNED', 'FRANCHISE', 'WAREHOUSE'],
            required: true
        },
        location: { type: String, required: true },
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true } // Automatically manages createdAt and updatedAt
);

export const Branch = mongoose.model<IBranch>('Branch', branchSchema);