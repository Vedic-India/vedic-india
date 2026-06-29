import mongoose from "mongoose";
import { Cart } from "../models/cart.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";
import { randomUUID } from "crypto";

const generateCartResponse = (cart) => {
    let subtotal = 0;
    let totalItems = 0;
    let hasUnavailableItems = false;

    const items = cart.items.map((item) => {
        const product = item.product;

        // Product deleted
        if (!product) {
            hasUnavailableItems = true;
            return {
                product: null,
                quantity: item.quantity,
                priceAtAdd: item.priceAtAdd,
                unavailable: true
            };
        }

        if(product.isActive && product.stock >= item.quantity) {
            subtotal += product.price * item.quantity;
            totalItems += item.quantity;
        }
        else {
            hasUnavailableItems = true;
        }

        return {
            _id: product._id,
            name: product.name,
            slug: product.slug,
            image: product.images?.[0] ?? null,
            currentPrice: product.price,
            priceAtAdd: item.priceAtAdd,
            quantity: item.quantity,
            stock: product.stock,
            isActive: product.isActive,
            priceChanged: product.price !== item.priceAtAdd,
            unavailable: !product.isActive || product.stock < item.quantity
        };
    });
    return { items, subtotal, totalItems, hasUnavailableItems };
};

const getCart = asyncHandler(async (req, res) => {
    let cart;

    if (req.user) {
        cart = await Cart.findOne({ user: req.user._id }).populate({
            path: "items.product",
            select: "name slug price images stock isActive"
        });
    } else {
        const guestId = req.cookies?.guestId;

        if (!guestId) {
            return res.status(200).json(
                new ApiResponse(
                    200,
                    {
                        items: [],
                        subtotal: 0,
                        totalItems: 0,
                        hasUnavailableItems: false
                    },
                    "Cart is empty."
                )
            );
        }

        cart = await Cart.findOne({ guestId }).populate({
            path: "items.product",
            select: "name slug price images stock isActive"
        });
    }

    if (!cart) {
        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    items: [],
                    subtotal: 0,
                    totalItems: 0,
                    hasUnavailableItems: false
                },
                "Cart is empty."
            )
        );
    }

    const { items, subtotal, totalItems, hasUnavailableItems } = generateCartResponse(cart);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                items,
                subtotal,
                totalItems,
                hasUnavailableItems
            },
            "Cart fetched successfully."
        )
    );
});

const clearCart = asyncHandler(async (req, res) => {
    let cart;
    if (req.user) {
        cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            throw new ApiError(404, "Cart not found.");
        }
        cart.items = [];
        await cart.save();
    } else {
        const guestId = req.cookies?.guestId;
        cart = await Cart.findOne({ guestId });
        if (!cart) {
            throw new ApiError(404, "Cart not found.");
        }
        cart.items = [];
        await cart.save();
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {
        items: [],
        subtotal: 0,
        totalItems: 0,
        hasUnavailableItems: false
    }, "Cart cleared successfully."));
});

const addItemToCart = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    if(!productId?.trim() || !mongoose.Types.ObjectId.isValid(productId)) {
        throw new ApiError(400, "Invalid product ID.");
    }

    const product = await Product.findById(productId).select("price isActive stock");
    if(!product) {
        throw new ApiError(404, "Product not found.");
    }
    if(!product.isActive) {
        throw new ApiError(400, "Product is not available for sale.");
    }
    if(product.stock < 1) {
        throw new ApiError(400, "Product is out of stock.");
    }

    let cart;
    if(req.user) {
        cart = await Cart.findOne({ user: req.user._id });
        if(!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }
    } else {
        let guestId = req.cookies?.guestId;
        if(!guestId) {
            guestId = randomUUID(); // Generate a new guest ID
            res.cookie("guestId", guestId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days
            });
            cart = await Cart.create({ guestId, items: [] });
        }
        else {
            cart = await Cart.findOne({ guestId });
            if(!cart) {
                cart = await Cart.create({ guestId, items: [] });
            }
        }
    }

    // Check if product already exists in cart
    const existingItem = cart.items.find(item => item.product.toString() === productId);
    
    if (existingItem) {
        if (existingItem.quantity >= product.stock) {
            throw new ApiError(400, "Product quantity exceeds available stock.");
        }
        if (existingItem.quantity >= 10) {
            throw new ApiError(400, "Product quantity cannot exceed 10.");
        }
        existingItem.quantity += 1;
    } else {
        cart.items.push({ product: productId, quantity: 1, priceAtAdd: product.price });
    }

    await cart.save();

    await cart.populate({
        path: "items.product",
        select: "name slug price images stock isActive"
    });

    const { items, subtotal, totalItems, hasUnavailableItems } = generateCartResponse(cart);

    return res
    .status(201)
    .json(new ApiResponse(201, { items, subtotal, totalItems, hasUnavailableItems }, "Product added to cart successfully."));
});

const updateCartItemQuantity = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;

    if(!productId?.trim() || !mongoose.Types.ObjectId.isValid(productId)) {
        throw new ApiError(400, "Invalid product ID.");
    }
    if( !Number.isInteger(quantity) || quantity < 0) {
        throw new ApiError(400, "Invalid quantity.");
    }
    if(quantity > 10) {
        throw new ApiError(400, "Quantity cannot exceed 10.");
    }

    let cart;
    if (req.user) {
        cart = await Cart.findOne({ user: req.user._id }).populate({
            path: "items.product",
            select: "name slug price images stock isActive"
        });
    } else {
        const guestId = req.cookies?.guestId;
        cart = await Cart.findOne({ guestId }).populate({
            path: "items.product",
            select: "name slug price images stock isActive"
        });
    }
    if(!cart) {
        throw new ApiError(404, "Cart not found.");
    }

    const item = cart.items.find(item => {
        if(!item.product) return false; // product might have been deleted
        return item.product._id.toString() === productId;
    });

    if (!item) {
        throw new ApiError(404, "Item not found in cart.");
    }
    if(quantity > item.product.stock) {
       throw new ApiError(400, "Product quantity exceeds available stock.");
    }

    if(quantity === 0) {
        cart.items = cart.items.filter(item => {
            if(!item.product) return true; // keep items with deleted products
            return item.product._id.toString() !== productId;
        });
    } else {
        item.quantity = quantity;
    }

    await cart.save();

    const { items, subtotal, totalItems, hasUnavailableItems } = generateCartResponse(cart);

    return res
        .status(200)
        .json(new ApiResponse(200, { items, subtotal, totalItems, hasUnavailableItems }, "Cart item quantity updated successfully."));
});

const removeCartItem = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    if(!productId?.trim() || !mongoose.Types.ObjectId.isValid(productId)) {
        throw new ApiError(400, "Invalid product ID.");
    }

    let cart;
    if (req.user) {
        cart = await Cart.findOne({ user: req.user._id });
    } else {
        const guestId = req.cookies?.guestId;

        cart = await Cart.findOne({ guestId });
    }

    if (!cart) {
        throw new ApiError(404, "Cart not found.");
    }

    const itemExists = cart.items.some(
        item => item.product.toString() === productId
    );

    if (!itemExists) {
        throw new ApiError(404, "Item not found in cart.");
    }

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();

    await cart.populate({
        path: "items.product",
        select: "name slug price images stock isActive"
    });

    const { items, subtotal, totalItems, hasUnavailableItems } = generateCartResponse(cart);

    return res
        .status(200)
        .json(new ApiResponse(200, { items, subtotal, totalItems, hasUnavailableItems }, "Item removed from cart successfully."));
});

export { getCart, clearCart, addItemToCart, updateCartItemQuantity, removeCartItem };