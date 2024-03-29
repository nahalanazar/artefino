import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    // images: [String],
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    stores: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    latitude: {
        type: String
    },
    longitude: {
        type: String
    },
    address: {
        type: String
    },
    dateListed: {
        type: Date,
        default: Date.now
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            text: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    reports: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Report'
        }
    ],
    isRemoved: {
        type: Boolean,
        default: false,
    }
});

const Product = mongoose.model('Product', productSchema);

export default Product;
