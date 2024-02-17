import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

@Schema({ timestamps: true })
export class OTP {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: User;

  @Prop({ type: String, unique: true })
  otp: string;

  @Prop()
  expiry: Date;

  constructor(otp: Partial<OTP>) {
    Object.assign(this, otp);
  }
}

export type OTPDocument = OTP & Document;

export const OTPSchema = SchemaFactory.createForClass(OTP);
