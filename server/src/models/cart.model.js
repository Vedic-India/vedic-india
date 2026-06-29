import { Schema, model } from "mongoose";

const cartItemSchema = new Schema(
  {
    product: { 
      type: Schema.Types.ObjectId, 
      ref: 'Product', 
      required: true 
    },
    quantity: { 
      type: Number, 
      required: true, 
      min: 1, 
      max: 10, 
      default: 1 
    },
    priceAtAdd: { 
      type: Number, 
      required: true 
    }, // for showing "price changed" notices in UI
  },
  { _id: false }
);

const cartSchema = new Schema(
  {
    // exactly one of these two will be set
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        unique: true, 
        sparse: true 
    },
    guestId: { 
        type: String, 
        unique: true, 
        sparse: true 
    }, // store in a cookie/localStorage for guests

    items: [cartItemSchema],
  },
  { timestamps: true }
);

cartSchema.pre("validate", function(next) {
  const hasUser = !!this.user;
  const hasGuest = !!this.guestId;

  if (hasUser === hasGuest) {
    return next(
      new Error("Cart must belong to either a user or a guest")
    );
  }

  next();
});

export const Cart = model('Cart', cartSchema);