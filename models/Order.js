import mongoose from 'mongoose';
const { Schema } = mongoose;

const orderSchema = new Schema(
    {
        comprobante: { type: String, required: true },
        nombre: { type: String, required: true },
        correo: { type: String, required: true },
        telefono: { type: String, required: true },
        monto: { type: Number, required: true },
        aprobado: { type: Boolean, default: false },
        vistoPorAdmin: { type: Boolean, default: false },
        products: [{
            productId: { type: Schema.Types.ObjectId, ref: 'Products', required: true },
            cantidad: { type: Number, required: true },
        }],
    },
    { timestamps: true, toJSON: { virtuals: true } }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
