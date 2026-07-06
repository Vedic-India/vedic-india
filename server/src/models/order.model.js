import { Schema, model } from "mongoose";

const orderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true }, // snapshot at purchase time
  price: { type: Number, required: true }, // snapshot at purchase time
  quantity: { type: Number, required: true, min: 1 },
});

const shippingAddressSchema = new Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, default: 'India' },
});

const orderSchema = new Schema(
  {
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    items: [orderItemSchema],
    shippingAddress: shippingAddressSchema,

    itemsTotal: { 
        type: Number, 
        required: true 
    },
    shippingFee: { 
        type: Number, 
        default: 0 
    },
    totalAmount: { 
        type: Number, 
        required: true 
    },

    paymentInfo: {
      method: { type: String, enum: ['razorpay', 'cod'], default: 'razorpay' },
      razorpayOrderId: { type: String },
      razorpayPaymentId: { type: String },
      razorpaySignature: { type: String },
      status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    },

    orderStatus: {
      type: String,
      enum: ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'placed',
    },
  },
  { timestamps: true }
);

module.exports = model('Order', orderSchema);