import mongoose from 'mongoose';
const { Schema } = mongoose;

const productSchema = new Schema(
    {
        imageUrl: { type: [String], required: true },
        name: { type: String, required: true },
        price: { type: String, required: true },
        description: { type: String, required: true },
        categories: [{ type: Schema.Types.ObjectId, ref: 'ProductCategories', required: true }],
        stock: { type: Number, required: true },
    },
    { timestamps: true, toJSON: { virtuals: true } });

const Product = mongoose.model('Product', productSchema);

export default Product;
