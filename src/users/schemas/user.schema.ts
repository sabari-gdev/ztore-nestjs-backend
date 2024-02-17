import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Role } from '../enums/role.enum';
import { AccountStatus } from '../enums/account.status.enum';

@Schema({ timestamps: true })
export class User {
  @Prop()
  id: string;

  @Prop({ required: true })
  firstName: string;

  @Prop()
  lastName?: string;

  @Prop({ unique: true, required: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, unique: true, default: '' })
  mobileNumber: string;

  @Prop({ required: true, enum: Role, default: Role.USER, type: String })
  role: Role;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }],
    default: [],
  })
  addresses: mongoose.Schema.Types.ObjectId[];

  @Prop({
    type: String,
    enum: AccountStatus,
    default: AccountStatus.NotVerified,
  })
  accountStatus: AccountStatus;

  @Prop({ expires: '1h' })
  verificationToken: string;

  @Prop({ type: Boolean, default: false })
  verified: boolean;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
