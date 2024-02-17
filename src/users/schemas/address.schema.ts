import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AddressType } from '../enums/address.type.enum';

@Schema()
export class Address {
  @Prop()
  street: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  pincode: string;

  @Prop({ enum: AddressType })
  type: AddressType;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
