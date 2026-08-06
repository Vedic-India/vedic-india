import { Schema, model } from "mongoose";

const orderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    slug: { type: String, required: true},
    name: { type: String, required: true }, // snapshot at purchase time
    price: { type: Number, required: true }, // snapshot at purchase time
    image: { type: String, required: true }, // snapshot at purchase time
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const shippingAddressSchema = new Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId, 
      ref: 'User',
      required: true 
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: arr => arr.length > 0,
        message: "Order must contain at least one item."
      }
    },
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
      amount: { type: Number, required: true },
      method: { type: String, enum: ['razorpay', 'cod'], default: 'razorpay' },
      razorpayOrderId: { type: String },
      razorpayPaymentId: { type: String },
      razorpaySignature: { type: String },
      status: { type: String, enum: ['pending', 'processing', 'paid', 'failed', 'refunded'], default: 'pending' },
      paidAt: { type: Date },
      failureReason: { type: String },
      refundId: { type: String },
      refundedAt: { type: Date },
    },

    orderStatus: {
      type: String,
      enum: ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'placed',
    },

    shippedAt: { type: Date },

    deliveredAt: { type: Date },

    cancelledAt: { type: Date },
  },
  { timestamps: true }
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ createdAt: -1, _id: -1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });
orderSchema.index({ "paymentInfo.status": 1, createdAt: -1 });

export const Order = model('Order', orderSchema);