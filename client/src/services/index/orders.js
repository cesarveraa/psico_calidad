import axios from 'axios';

// Configuración común para las solicitudes
const config = (token) => ({
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
    },
});

// Crear un nuevo pedido
export const createOrder = async (orderData, token) => {
    try {
        const { data } = await axios.post('/api/order/orders', orderData, config(token));
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

// Obtener todos los pedidos
export const getAllOrders = async (token) => {
    try {
        const { data } = await axios.get('/api/order/orders', config(token));
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

// Obtener un pedido por ID
export const getOrderById = async (id, token) => {
    try {
        const { data } = await axios.get(`/api/order/orders/${id}`, config(token));
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

// Actualizar un pedido existente
export const updateOrder = async (id, updatedData, token) => {
    try {
        const { data } = await axios.put(`/api/order/orders/${id}`, updatedData, config(token));
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

// Eliminar un pedido
export const deleteOrder = async (id, token) => {
    try {
        const { data } = await axios.delete(`/api/order/orders/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

// Cambiar el estado de aprobación de un pedido
export const setOrderApprovalStatus = async (id, aprobado, token, emailContent) => {
    try {
        const { data } = await axios.patch(`/api/order/orders/${id}/approve`, 
            { aprobado, emailContent }, // Asegúrate de enviar el contenido del correo
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json', // Asegúrate de que el tipo de contenido sea JSON
                },
            }
        );
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

// Cambiar el estado de visto por admin de un pedido
export const setOrderAdminViewStatus = async (id, vistoPorAdmin, token) => {
    try {
        const { data } = await axios.patch(`/api/order/orders/${id}/view`, { vistoPorAdmin }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};
