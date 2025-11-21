/**
 * tiendaTests.test.js
 *
 * Suite de pruebas unitarias para la "tienda":
 * - Controlador de Pedidos (Order)
 * - Controlador de Productos (Product)
 * - Controlador de Formas de Pago (FormaPago)
 *
 * Todas las pruebas siguen el patrón AAA:
 * 1) PREPARACIÓN (Arrange)
 * 2) LÓGICA / EJECUCIÓN (Act)
 * 3) VERIFICACIÓN / ASSERT (Assert)
 */

import fs from 'fs';

// MODELOS
import Order from '../models/order';
import Product from '../models/Productos';
import FormaPago from '../models/FormaPago';

// SERVICIOS
import { sendApprovalEmail } from '../services/emailOrdersService';

// CONTROLADORES
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  setOrderApprovalStatus,
  setOrderAdminViewStatus,
} from '../controllers/orderController';

import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';

import {
  createFormaPago,
  getAllFormaPago,
  getFormaPagoById,
  updateFormaPago,
  deleteFormaPago,
} from '../controllers/formaPagoController';

// MOCKS DE MÓDULOS
jest.mock('../models/order');
jest.mock('../models/Productos');
jest.mock('../models/FormaPago');
jest.mock('../services/emailOrdersService');
jest.mock('fs');

// Helpers para simular res y next
const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const createMockNext = () => jest.fn();

describe('tiendaTests - Pruebas unitarias de Order, Product y FormaPago (AAA)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // fs.unlink simulando que siempre funciona
    fs.unlink.mockImplementation((path, cb) => cb && cb(null));
  });

  // ============================================================================
  // 1) createOrder - debe crear un pedido y devolver 201
  // ============================================================================
  test('1) createOrder - crea un nuevo pedido y responde 201', async () => {
    // 1) PREPARACIÓN (Arrange)
    const req = {
      body: {
        nombre: 'Juan Pérez',
        correo: 'juan@example.com',
        telefono: '70000000',
        monto: 150,
        products: JSON.stringify([
          { productId: 'p1', quantity: 2 },
          { productId: 'p2', quantity: 1 },
        ]),
      },
      file: { filename: 'comprobante.jpg' },
    };
    const res = createMockResponse();
    const next = createMockNext();

    const savedOrder = {
      _id: 'order123',
      comprobante: '/uploads/comprobante.jpg',
      nombre: req.body.nombre,
      correo: req.body.correo,
      telefono: req.body.telefono,
      monto: req.body.monto,
      products: JSON.parse(req.body.products),
    };

    // Simulamos new Order(...) y .save()
    Order.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(savedOrder),
    }));

    // 2) LÓGICA (Act)
    await createOrder(req, res, next);

    // 3) VERIFICACIÓN (Assert)
    expect(Order).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(savedOrder);
    expect(next).not.toHaveBeenCalled();
  });

  // ============================================================================
  // 2) getAllOrders - debe devolver la lista de pedidos
  // ============================================================================
  test('2) getAllOrders - devuelve todos los pedidos en JSON', async () => {
    // 1) PREPARACIÓN (Arrange)
    const req = {};
    const res = createMockResponse();

    const orders = [
      { _id: 'o1', nombre: 'Cliente 1' },
      { _id: 'o2', nombre: 'Cliente 2' },
    ];

    Order.find.mockResolvedValue(orders);

    // 2) LÓGICA (Act)
    await getAllOrders(req, res);

    // 3) VERIFICACIÓN (Assert)
    expect(Order.find).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(orders);
  });

  // ============================================================================
  // 3) getOrderById - 404 cuando el pedido no existe
  // ============================================================================
  test('3) getOrderById - responde 404 si el pedido no existe', async () => {
    // 1) PREPARACIÓN (Arrange)
    const req = { params: { id: 'no-existe' } };
    const res = createMockResponse();
    const next = createMockNext();

    Order.findById.mockResolvedValue(null);

    // 2) LÓGICA (Act)
    await getOrderById(req, res, next);

    // 3) VERIFICACIÓN (Assert)
    expect(Order.findById).toHaveBeenCalledWith('no-existe');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Pedido no encontrado' });
    expect(next).not.toHaveBeenCalled();
  });

  // ============================================================================
  // 4) updateOrder - 404 cuando el pedido no existe
  // ============================================================================
  test('4) updateOrder - responde 404 si el pedido a actualizar no existe', async () => {
    // 1) PREPARACIÓN (Arrange)
    const req = {
      params: { id: 'no-existe' },
      body: {},
      file: null,
    };
    const res = createMockResponse();
    const next = createMockNext();

    Order.findById.mockResolvedValue(null);

    // 2) LÓGICA (Act)
    await updateOrder(req, res, next);

    // 3) VERIFICACIÓN (Assert)
    expect(Order.findById).toHaveBeenCalledWith('no-existe');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Pedido no encontrado' });
    expect(next).not.toHaveBeenCalled();
  });

  // ============================================================================
  // 5) setOrderApprovalStatus - aprueba pedido y envía correo
  // ============================================================================
  test('5) setOrderApprovalStatus - marca como aprobado y envía correo', async () => {
    // 1) PREPARACIÓN (Arrange)
    const req = {
      params: { id: 'order123' },
      body: {
        aprobado: true,
        emailContent: 'Tu pedido ha sido aprobado',
      },
    };
    const res = createMockResponse();
    const next = createMockNext();

    const order = {
      _id: 'order123',
      aprobado: false,
      save: jest.fn().mockResolvedValue({ _id: 'order123', aprobado: true }),
    };

    Order.findById.mockResolvedValue(order);

    // 2) LÓGICA (Act)
    await setOrderApprovalStatus(req, res, next);

    // 3) VERIFICACIÓN (Assert)
    expect(Order.findById).toHaveBeenCalledWith('order123');
    expect(order.aprobado).toBe(true); // se actualiza en memoria
    expect(order.save).toHaveBeenCalled();
    expect(sendApprovalEmail).toHaveBeenCalledWith(
      order,
      'Tu pedido ha sido aprobado'
    );
    expect(res.json).toHaveBeenCalledWith({ _id: 'order123', aprobado: true });
    expect(next).not.toHaveBeenCalled();
  });

  // ============================================================================
  // 6) createProduct - debe crear un producto y devolver 201
  // ============================================================================
  test('6) createProduct - crea un nuevo producto y responde 201', async () => {
    // 1) PREPARACIÓN (Arrange)
    const req = {
      body: {
        name: 'Producto de prueba',
        price: 99.9,
        description: 'Descripción de prueba',
        // IMPORTANTE: [] para evitar errores de ObjectId en la prueba
        categories: JSON.stringify([]),
        stock: 5,
      },
      files: [{ filename: 'foto1.jpg' }, { filename: 'foto2.jpg' }],
    };
    const res = createMockResponse();
    const next = createMockNext();

    const savedProduct = {
      _id: 'prod123',
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      categories: [],
      stock: req.body.stock,
      imageUrl: ['/uploads/foto1.jpg', '/uploads/foto2.jpg'],
    };

    Product.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(savedProduct),
    }));

    // 2) LÓGICA (Act)
    await createProduct(req, res, next);

    // 3) VERIFICACIÓN (Assert)
    expect(Product).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(savedProduct);
    expect(next).not.toHaveBeenCalled();
  });

  // ============================================================================
  // 7) getProductById - 404 cuando el producto no existe
  // ============================================================================
  test('7) getProductById - responde 404 si el producto no existe', async () => {
    // 1) PREPARACIÓN (Arrange)
    const req = { params: { id: 'no-existe' } };
    const res = createMockResponse();
    const next = createMockNext();

    Product.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });

    // 2) LÓGICA (Act)
    await getProductById(req, res, next);

    // 3) VERIFICACIÓN (Assert)
    expect(Product.findById).toHaveBeenCalledWith('no-existe');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Producto no encontrado' });
    expect(next).not.toHaveBeenCalled();
  });

  // ============================================================================
  // 8) deleteProduct - elimina producto e imágenes asociadas
  // ============================================================================
  test('8) deleteProduct - elimina el producto y sus imágenes', async () => {
    // 1) PREPARACIÓN (Arrange)
    const req = { params: { id: 'prod123' } };
    const res = createMockResponse();
    const next = createMockNext();

    const deleteOneMock = jest.fn().mockResolvedValue(true);
    const product = {
      _id: 'prod123',
      imageUrl: ['/uploads/foto1.jpg', '/uploads/foto2.jpg'],
      deleteOne: deleteOneMock,
    };

    Product.findById.mockResolvedValue(product);

    // 2) LÓGICA (Act)
    await deleteProduct(req, res, next);

    // 3) VERIFICACIÓN (Assert)
    expect(Product.findById).toHaveBeenCalledWith('prod123');
    // se intentan borrar las 2 imágenes
    expect(fs.unlink).toHaveBeenCalledTimes(2);
    expect(deleteOneMock).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      message: 'Producto eliminado exitosamente',
    });
    expect(next).not.toHaveBeenCalled();
  });

  // ============================================================================
  // 9) createFormaPago - crea una forma de pago y devuelve 201
  // ============================================================================
  test('9) createFormaPago - crea una nueva forma de pago y responde 201', async () => {
    // 1) PREPARACIÓN (Arrange)
    const req = {
      body: { name: 'QR Banco X' },
      file: { filename: 'qr.png' },
    };
    const res = createMockResponse();
    const next = createMockNext();

    const savedFormaPago = {
      _id: 'fp123',
      name: req.body.name,
      imageUrl: '/uploads/qr.png',
    };

    FormaPago.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(savedFormaPago),
    }));

    // 2) LÓGICA (Act)
    await createFormaPago(req, res, next);

    // 3) VERIFICACIÓN (Assert)
    expect(FormaPago).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(savedFormaPago);
    expect(next).not.toHaveBeenCalled();
  });

  // ============================================================================
  // 10) deleteFormaPago - responde 404 si la forma de pago no existe
  // ============================================================================
  test('10) deleteFormaPago - responde 404 si la forma de pago no existe', async () => {
    // 1) PREPARACIÓN (Arrange)
    const req = { params: { id: 'no-existe' } };
    const res = createMockResponse();
    const next = createMockNext();

    FormaPago.findById.mockResolvedValue(null);

    // 2) LÓGICA (Act)
    await deleteFormaPago(req, res, next);

    // 3) VERIFICACIÓN (Assert)
    expect(FormaPago.findById).toHaveBeenCalledWith('no-existe');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Forma de pago no encontrada',
    });
    expect(next).not.toHaveBeenCalled();
  });
});
