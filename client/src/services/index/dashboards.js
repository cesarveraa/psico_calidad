import axios from "axios";

// Actualizar totalVisualizaciones
export const updateTotalVisualizaciones = async (totalVisualizaciones) => {
    try {
        const { data } = await axios.put('/api/dashboard/total-visualizaciones', { totalVisualizaciones });
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

// Actualizar nuevosUsuarios
export const updateNuevosUsuarios = async (nuevosUsuarios, token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        };

        const { data } = await axios.put('/api/dashboard/nuevos-usuarios', { nuevosUsuarios }, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

// Actualizar tiempoPromedioVisita
export const updateTiempoPromedioVisita = async (tiempoPromedioVisita, token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        };

        const { data } = await axios.put('/api/dashboard/tiempo-promedio-visita', { tiempoPromedioVisita }, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

// Actualizar totalCompartidos y incrementar su valor
export const updateTotalCompartidos = async (token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        };

        const { data } = await axios.put('/api/dashboard/total-compartidos/increment', {}, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

// Actualizar compartidos
export const updateCompartidos = async (compartido, token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        };

        const { data } = await axios.put('/api/dashboard/compartidos', { compartido }, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

// Actualizar compartidos por plataforma
export const updateCompartidosPorPlataforma = async ({ plataforma, categoria }, token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        };

        const { data } = await axios.put('/api/dashboard/compartidos-por-plataforma', { plataforma, categoria }, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

// Actualizar eventos asistidos
export const updateEventosAsistidos = async (eventosAsistidos, token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        };

        const { data } = await axios.put('/api/dashboard/eventos-asistidos', { eventosAsistidos }, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

// Actualizar estudiantes por sexo
export const updateEstudiantesPorSexo = async (estudiantesPorSexo, token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        };

        const { data } = await axios.put('/api/dashboard/estudiantes-por-sexo', { estudiantesPorSexo }, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

// Obtener todos los datos del dashboard
export const getDashboardData = async () => {
    try {
        const { data } = await axios.get('/api/dashboard');
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

// Actualizar categorías en todas las plataformas
export const anadirCategoriaATodasLasPlataformas = async (nuevaCategoria, token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        };

        const { data } = await axios.put('/api/dashboard/anadir-categoria-todas-plataformas', { nuevaCategoria }, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

// Eliminar una categoría de todas las plataformas
export const eliminarCategoriaDeTodasLasPlataformas = async (categoriaEliminada, token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        };

        const { data } = await axios.delete('/api/dashboard/eliminar-categoria', {
            data: { categoriaEliminada }, // Enviando data en el cuerpo de una solicitud DELETE
            headers: config.headers
        });
        return data;
    } catch (error) {
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error(error.message);
    }
};
