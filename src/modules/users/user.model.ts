import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

// Define the TypeScript interface for User
export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
    role: 'SUPER_ADMIN' | 'BRANCH_MANAGER' | 'POS_EMPLOYEE' | 'CUSTOMER' | 'SUPPLIER';
    branchId?: mongoose.Types.ObjectId; // If the employee is assigned to a specific branch
}

// Define the Mongoose schema for User
const userSchema = new Schema<IUser>(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        passwordHash: { type: String, required: true },
        role: {
            type: String,
            enum: ['SUPER_ADMIN', 'BRANCH_MANAGER', 'POS_EMPLOYEE', 'CUSTOMER', 'SUPPLIER'],
            required: true
        },
        // Link the user to a specific branch (e.g., Branch Manager or POS Employee)
        branchId: { type: Schema.Types.ObjectId, ref: 'Branch', default: null }
    },
    { timestamps: true } // Automatically manages createdAt and updatedAt
);

// Automatically hash the password before saving it to the database
userSchema.pre('save', async function () {
  const user = this as IUser; 
  
  // If the password hasn't been modified, skip hashing
  if (!user.isModified('passwordHash')) return;
  
  const salt = await bcrypt.genSalt(10);
  user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
});

export const User = mongoose.model<IUser>('User', userSchema);