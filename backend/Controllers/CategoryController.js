import Category from '../models/CategorySchema.js';
import Product from '../models/ProductSchema.js';


export const createCategory = async (req, res) => {
    try {
        const { name, description, parentCategoryId } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: "Category name is required." });
        }

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(409).json({ success: false, message: "Category with this name already exists." });
        }

        const newCategory = new Category({ name, description });

        if (parentCategoryId) {
            const parentCategory = await Category.findById(parentCategoryId);
            if (!parentCategory) {
                return res.status(404).json({ success: false, message: "Parent category not found." });
            }
            newCategory.parentCategory = parentCategoryId;
            parentCategory.subcategories.push(newCategory._id);
            await parentCategory.save();
        }

        await newCategory.save();

        res.status(201).json({ success: true, message: "Category created successfully", data: newCategory });
    } catch (error) {
        console.error("Error creating category:", error.message);
        res.status(500).json({ success: false, message: "Server error creating category." });
    }
};

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({ parentCategory: null })
            .populate('subcategories');
            
        res.status(200).json({ success: true, message: "Categories fetched successfully", data: categories });
    } catch (error) {
        console.error("Error fetching categories:", error.message);
        res.status(500).json({ success: false, message: "Server error fetching categories." });
    }
};


export const getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        // Find the category and all its subcategories
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found." });
        }

        // Collect all category IDs to query, including the main category and its subcategories
        const categoryIds = [categoryId];
        if (category.subcategories && category.subcategories.length > 0) {
            categoryIds.push(...category.subcategories);
        }

        // Find all products that belong to any of the collected category IDs
        const products = await Product.find({ category: { $in: categoryIds } }).populate('seller').lean();

        res.status(200).json({ success: true, message: "Products fetched successfully", data: products });
    } catch (error) {
        console.error("Error fetching products by category:", error.message);
        res.status(500).json({ success: false, message: "Server error fetching products." });
    }
};
