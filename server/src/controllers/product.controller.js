import slugify from "slugify";
import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import fs from "fs";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

const createProduct = asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
        throw new ApiError(400, "At least one product image is required.");
    }
    const cleanupFiles = () => {
        for (const file of req.files) {
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path)
            }
        }
    };

    const { name, description, price, stock } = req.body;

    // Validate required fields
    if (!name?.trim() || !description?.trim()) {
        cleanupFiles();
        throw new ApiError(400, "Name and description are required.");
    }

    if (!price || isNaN(price) || Number(price) < 1) {
        cleanupFiles();
        throw new ApiError(400, "Price must be a number greater than or equal to 1.");
    }
    if (stock === undefined || isNaN(stock) || Number(stock) < 0) {
        cleanupFiles();
        throw new ApiError(400, "Stock must be a number greater than or equal to 0.");
    }

    const slug = slugify(name, {
        lower: true,
        strict: true,
        trim: true,
    });

    // Check duplicate slug
    const existingProduct = await Product.findOne({ slug });

    if (existingProduct) {
        cleanupFiles();
        throw new ApiError(409, "A product with this name already exists.");
    }

    // Upload images
    const uploadedImages = [];
    let flag = false;

    for (const file of req.files) {
        const uploadedImage = await uploadOnCloudinary(file.path);

        if (!uploadedImage) {
            flag = true;
            break;
        }

        uploadedImages.push({
            url: uploadedImage.url,
            publicId: uploadedImage.publicId,
        });
    }

    if (flag) {
        // Delete uploaded images from Cloudinary
        for (const image of uploadedImages) {
            await deleteFromCloudinary(image.publicId);
        }
        cleanupFiles();
        throw new ApiError(500, "Failed to upload one or more product images.");
    }

    // Create product
    try{
        const product = await Product.create({
            name: name.trim(),
            slug,
            description: description.trim(),
            price: Number(price),
            stock: Number(stock),
            images: uploadedImages,
        });

        return res
        .status(201)
        .json(new ApiResponse( 201, product, "Product created successfully."));
    }catch(err){
        for (const image of uploadedImages) {
            await deleteFromCloudinary(image.publicId);
        }
        console.error("Error creating product:", err);
        throw new ApiError(500, "Failed to create product.");
    }
});

const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
    return res
        .status(200)
        .json(new ApiResponse(200, products, "Products retrieved successfully."));
});

const getAllProductsAdmin = asyncHandler(async (req, res) => {
    const products = await Product.find().sort({ createdAt: -1 });
    return res
        .status(200)
        .json(new ApiResponse(200, products, "Products retrieved successfully."));
});

const getProductBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    if(!slug?.trim()){
        throw new ApiError(400, "Product slug is required.");
    }

    const product = await Product.findOne({ slug, isActive: true });

    if (!product) {
        throw new ApiError(404, "Product not found.");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, product, "Product retrieved successfully."));
});

const updateProduct = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    if(!slug?.trim()){
        throw new ApiError(400, "Product slug is required.");
    }

    const { name, description, price, stock } = req.body;
    if(!name?.trim() || !description?.trim()){
        throw new ApiError(400, "Name and description are required.");
    }
    if(!price || isNaN(price) || Number(price) < 1){
        throw new ApiError(400, "Price must be a number greater than or equal to 1.");
    }
    if(stock === undefined || isNaN(stock) || Number(stock) < 0){
        throw new ApiError(400, "Stock must be a number greater than or equal to 0.");
    }

    const newSlug = slugify(name, {
        lower: true,
        strict: true,
        trim: true,
    });

    const existingProduct = await Product.findOne({ slug: newSlug});
    if (existingProduct && existingProduct.slug !== slug) {
        throw new ApiError(409, "A product with this name already exists.");
    }

    const updatedProduct = await Product.findOneAndUpdate(
        { slug },
        {
            name: name.trim(),
            description: description.trim(),
            price: Number(price),
            stock: Number(stock),
            slug: newSlug
        },
        { new: true }
    );

    if (!updatedProduct) {
        throw new ApiError(404, "Product not found.");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedProduct, "Product updated successfully."));
});

const toggleProductStatus = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    if(!slug?.trim()){
        throw new ApiError(400, "Product slug is required.");
    }

    const updatedProduct = await Product.findOneAndUpdate(
        { slug },
        [
            { 
                $set: { isActive: { $not: "$isActive" } } 
            }
        ],
        { new: true }
    );

    if(!updatedProduct) {
        throw new ApiError(404, "Product not found.");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedProduct, "Product status updated successfully."));
});

export { 
    createProduct,
    getAllProducts,
    getProductBySlug,
    updateProduct,
    toggleProductStatus,
    getAllProductsAdmin
};