import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import Product from '../models/productModel.js'
import mongoose from 'mongoose'
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // Import fileURLToPath

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { ObjectId } = mongoose.Types;

// desc   Create a Product
// route  GET /api/users/userPosts/:userId
// access Private
const createProduct = asyncHandler(async (req, res) => {
    const { title, description, category, latitude, longitude, address } = req.body;
    const images = req.files.map((file) => file.filename);

    let categoryId;
    try {
        categoryId = new ObjectId(category);
    } catch (error) {
        console.error('Invalid category ObjectId:', error);
        return res.status(400).json({ success: false, message: 'Invalid category ObjectId' });
    }

    // Create a new product
    const newProduct = new Product({
        title,
        description,
        category: categoryId,
        images,
        stores: req.user._id,
        latitude,
        longitude,
        address
    });
 
    // Save the product to the database
    const createdProduct = await newProduct.save();

    if (createProduct) {
        res.status(200).json({success: true, message: 'Product added successfully', postId: createdProduct._id });
    } else {
        res.status(404);
        throw new Error("Product is not created");
    }

});

// desc   Show all posts in home
// route  GET /api/users/showPosts
// access Private
const showPosts = asyncHandler(async (req, res) => {
    const posts = await Product.find().populate('category stores comments.user').exec()
    res.status(200).json(posts)
})

// desc   Show single posts details
// route  GET /api/users/postDetails/:postId
// access Private
const postDetails = asyncHandler(async (req, res) => {
    const postId = req.params.postId
    const post = await Product.findById(postId).populate('category stores').exec()
    res.status(200).json(post)
})

// desc   Get User's Posts inProfile Page 
// route  GET /api/users/userPosts/:userId
// access Private
const getUserPosts = asyncHandler(async (req, res) => {
    const id = req.params.userId
    const user = await User.findById(id)

    if (!user) {
      res.status(404).json({ error: 'User not found' });
    }

    const userPosts = await Product.find({ stores: id });
    res.status(200).json({userPosts});
});

// desc    Remove a Post
// route   DELETE /api/users/removePost/:postId
// access  Private
const removePost = asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    const post = await Product.findById(postId);

    if (!post) {
        res.status(404);
        throw new Error("Requested Post not found.");
    }

    // Remove images from the server
    if (post.images && post.images.length > 0) {
        post.images.forEach((imageName) => {
            const imagePath = path.join(__dirname, '../Public/ProductImages', imageName);
            // Check if the image file exists before attempting to delete
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
                console.log(`Deleted image: ${imageName}`);
            } else {
                console.log(`Image not found: ${imageName}`);
            }
        });
    }

    await Product.deleteOne({ _id: postId });
    res.status(200).json({ status: 'success', message: 'Removed Post successfully' });
})

// desc   update post
// route  PUT /api/users/updatePost/:postId
// access Private
const updatePost = asyncHandler(async (req, res) => {
    const post = await Product.findById(req.params.postId);

    if (post) {
        post.title = req.body.title || post.title;
        post.description = req.body.description || post.description;
        post.category = req.body.category || post.category
        post.latitude = req.body.latitude || post.latitude;
        post.longitude = req.body.longitude || post.longitude;
        post.address = req.body.address || post.address

        // Add existing images with new images
        if (req.body.existingImages) {
            const existingImages = req.body.existingImages.split(',');
            post.images = [...existingImages, ...req.files.map((file) => file.filename)];
        } else {
            // If no existing images, use only new images
            post.images = req.files.map((file) => file.filename);
        }

        const updatedPost = await post.save();
        res.status(200).json({status: 'success', message: "Post updated", postId: updatedPost._id});

    } else { 
        res.status(404);
        throw new Error("Requested Post not found.");
    };

});

// desc   add like to the Post
// route  POST /api/users/likePost/:postId
// access Private
const likePost = asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    const userId = req.user._id;
    const post = await Product.findById(postId)

    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }

    post.likes.push(userId)
    await post.save()

    res.status(200).json({ message: 'Like added successfully', likes: post.likes })
})

// desc   remove like to the Post
// route  DELETE /api/users/unlikePost/:postId
// access Private
const unlikePost = asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    const userId = req.user._id;
    const post = await Product.findById(postId)

    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the user has already liked the post
    const indexOfUser = post.likes.indexOf(userId);
    if (indexOfUser === -1) {
        return res.status(400).json({ message: 'User has not liked the post' });
    }

    // Remove the user from the likes array
    post.likes.splice(indexOfUser, 1);
    await post.save();

    res.status(200).json({ message: 'Like removed successfully', likes: post.likes });
})

// desc   add comment to the Post
// route  POST /api/users/commentPost/:postId
// access Private
const commentPost = asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    const userId = req.user._id;
    const text = req.body.text;
    const post = await Product.findById(postId)

    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }

    // Find the user and populate the necessary fields
    const user = await User.findById(userId).select('name profileImageName');

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const newComment = {
        user: user, // Assign the populated user
        text,
        date: new Date()
    }

    post.comments.push(newComment);
    await post.save();
    // Fetch the newly added comment from the post object
    const addedComment = post.comments[post.comments.length - 1];

    console.log("result:", addedComment._id);
console.log("comment added");
    res.status(200).json({ message: 'Comment added successfully', comment: addedComment });
});

// desc   add comment to the Post
// route  DELETE /api/users/commentDelete/:postId
// access Private
const commentDelete = asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    const commentId = req.body.commentId;
    console.log("postId,commentId ", postId, commentId);
    const result = await Product.updateOne(
      { _id: postId },
      { $pull: { comments: { _id: commentId } } }
    );
    if (result.modifiedCount > 0) {
        console.log('Comment deleted successfully');
        res.status(200).json({ message: 'Comment deleted successfully' });
    } else {
        console.log('Comment not found or deletion unsuccessful');
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



export {
    createProduct,
    showPosts,
    postDetails,
    getUserPosts,
    removePost,
    updatePost,
    likePost,
    unlikePost,
    commentPost,
    commentDelete
}
