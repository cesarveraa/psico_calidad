import mongoose from 'mongoose';
const { Schema } = mongoose;

const formaPagoSchema = new Schema(
    {
        imageUrl: { type: String, required: true },
        name: { type: String, required: true },
    },
    { timestamps: true, toJSON: { virtuals: true } });

const FormaPago = mongoose.model('FormaPago', formaPagoSchema);

export default FormaPago;
