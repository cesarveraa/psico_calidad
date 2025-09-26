import path from 'path';
import fs from 'fs';
import Order from '../models/order';
import { sendApprovalEmail } from '../services/emailOrdersService';

// Crear un nuevo pedido
export const createOrder = async (req, res, next) => {
    try {
        const { nombre, correo, telefono, monto, products } = req.body;
        const comprobante = req.file ? `/uploads/${req.file.filename}` : null;

        // Parsear el array de productos desde JSON
        const parsedProducts = JSON.parse(products);

        const newOrder = new Order({
            comprobante,
            nombre,
            correo,
            telefono,
            monto,
            products: parsedProducts,
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        next(error);
    }
};

// Obtener todos los pedidos
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un solo pedido por ID
export const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }
        res.json(order);
    } catch (error) {
        next(error);
    }
};

// Actualizar un pedido existente
export const updateOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nombre, correo, telefono, monto, products, aprobado, vistoPorAdmin } = req.body;
        const comprobante = req.file ? `/uploads/${req.file.filename}` : null;

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        if (comprobante) {
            // Eliminar la imagen anterior si existe
            if (order.comprobante) {
                const oldPath = path.join(__dirname, `../uploads/${path.basename(order.comprobante)}`);
                fs.unlink(oldPath, (err) => {
                    if (err) {
                        console.error(`Error al eliminar el archivo local: ${oldPath}`, err);
                    } else {
                        console.log(`Archivo local eliminado correctamente: ${oldPath}`);
                    }
                });
            }
            order.comprobante = comprobante;
        }

        order.nombre = nombre || order.nombre;
        order.correo = correo || order.correo;
        order.telefono = telefono || order.telefono;
        order.monto = monto || order.monto;
        order.products = products || order.products;
        if (typeof aprobado === 'boolean') order.aprobado = aprobado;
        if (typeof vistoPorAdmin === 'boolean') order.vistoPorAdmin = vistoPorAdmin;

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        next(error);
    }
};

// Eliminar un pedido
export const deleteOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        // Eliminar la imagen del comprobante si existe
        if (order.comprobante) {
            const photoPath = path.join(__dirname, `../uploads/${path.basename(order.comprobante)}`);
            fs.unlink(photoPath, (err) => {
                if (err) {
                    console.error(`Error al eliminar el archivo local: ${photoPath}`, err);
                } else {
                    console.log(`Archivo local eliminado correctamente: ${photoPath}`);
                }
            });
        }

        await order.deleteOne();
        res.json({ message: 'Pedido eliminado exitosamente' });
    } catch (error) {
        next(error);
    }
};

// Cambiar el estado de aprobado de un pedido
export const setOrderApprovalStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { aprobado, emailContent } = req.body;
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        if (typeof aprobado === 'boolean') {
            order.aprobado = aprobado;
        }

        const updatedOrder = await order.save();

        // Enviar correo si el estado de aprobado es true
        if (aprobado) {
            sendApprovalEmail(order, emailContent);
        }

        res.json(updatedOrder);
    } catch (error) {
        next(error);
    }
};

// Cambiar el estado de visto por admin de un pedido
export const setOrderAdminViewStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { vistoPorAdmin } = req.body;

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        if (typeof vistoPorAdmin === 'boolean') {
            order.vistoPorAdmin = vistoPorAdmin;
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        next(error);
    }
};
