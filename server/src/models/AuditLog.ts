import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  adminEmail: string;
  action: string;
  targetCollection: string;
  targetId?: string;
  details?: string;
  ipAddress?: string;
  createdAt: Date;
}

const AuditLogSchema: Schema<IAuditLog> = new Schema(
  {
    adminEmail: { type: String, required: true },
    action: { type: String, required: true },
    targetCollection: { type: String, required: true },
    targetId: { type: String },
    details: { type: String },
    ipAddress: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

AuditLogSchema.index({ createdAt: -1 });

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
