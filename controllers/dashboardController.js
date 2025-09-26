const Dashboard = require('../models/Dashboard');

// Registrar la entrada de una visita
const registrarEntrada = async (req, res) => {
    const { userId } = req.body;
    const entrada = new Date();

    const nuevaVisita = {
        userId,
        entrada,
        salida: null,
        duracion: null,
    };

    try {
        let dashboard = await Dashboard.findOne();
        if (!dashboard) {
            dashboard = new Dashboard();
        }
        dashboard.visitas.push(nuevaVisita);
        await dashboard.save();

        const visitaId = dashboard.visitas[dashboard.visitas.length - 1]._id;

        res.status(200).json({ message: 'Entrada registrada', visitaId });
    } catch (error) {
        res.status(500).json({ message: 'Error registrando la entrada', error });
    }
};

// Registrar la salida de una visita
const registrarSalida = async (req, res) => {
    const { visitaId } = req.body;
    const salida = new Date();

    try {
        const dashboard = await Dashboard.findOne();
        const visita = dashboard.visitas.id(visitaId);
        if (!visita) {
            return res.status(404).json({ message: 'Visita no encontrada' });
        }

        visita.salida = salida;
        visita.duracion = (salida - visita.entrada) / 60000; // Duración en minutos
        await dashboard.save();

        res.status(200).json({ message: 'Salida registrada', duracion: visita.duracion });
    } catch (error) {
        res.status(500).json({ message: 'Error registrando la salida', error });
    }
};

// Obtener el tiempo promedio de visita
const obtenerTiempoPromedioVisita = async (req, res) => {
    try {
        const dashboard = await Dashboard.findOne();
        const visitas = dashboard.visitas;
        if (visitas.length === 0) {
            return res.status(200).json({ tiempoPromedio: 0 });
        }

        const totalDuracion = visitas.reduce((acc, visita) => acc + visita.duracion, 0);
        const tiempoPromedio = totalDuracion / visitas.length;

        dashboard.tiempoPromedioVisita = tiempoPromedio;
        await dashboard.save();

        res.status(200).json({ tiempoPromedio });
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo el tiempo promedio de visita', error });
    }
};

// Obtener todos los datos del dashboard
const obtenerDashboard = async (req, res) => {
    try {
        const dashboard = await Dashboard.findOne();
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard no encontrado' });
        }
        res.status(200).json(dashboard);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo el dashboard', error });
    }
};

// Actualizar el campo totalCompartidos
const actualizarTotalCompartidos = async (req, res) => {
    const { totalCompartidos } = req.body;

    try {
        const dashboard = await Dashboard.findOne();
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard no encontrado' });
        }
        dashboard.totalCompartidos = totalCompartidos;
        await dashboard.save();

        res.status(200).json(dashboard);
    } catch (error) {
        res.status(500).json({ message: 'Error actualizando totalCompartidos', error });
    }
};

// Actualizar el campo totalVisualizaciones incrementándolo en 1
const actualizarTotalVisualizaciones = async (req, res) => {
    try {
        const dashboard = await Dashboard.findOne();
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard no encontrado' });
        }

        // Incrementar totalVisualizaciones en 1
        dashboard.totalVisualizaciones = (dashboard.totalVisualizaciones || 0) + 1;
        await dashboard.save();

        res.status(200).json(dashboard);
    } catch (error) {
        res.status(500).json({ message: 'Error actualizando totalVisualizaciones', error });
    }
};

// Actualizar el campo nuevosUsuarios
const actualizarNuevosUsuarios = async (req, res) => {
    const { nuevosUsuarios } = req.body;

    try {
        const dashboard = await Dashboard.findOne();
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard no encontrado' });
        }
        dashboard.nuevosUsuarios = nuevosUsuarios;
        await dashboard.save();

        res.status(200).json(dashboard);
    } catch (error) {
        res.status(500).json({ message: 'Error actualizando nuevosUsuarios', error });
    }
};

// Actualizar el campo tiempoPromedioVisita
const actualizarTiempoPromedioVisita = async (req, res) => {
    const { tiempoPromedioVisita } = req.body;

    try {
        const dashboard = await Dashboard.findOne();
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard no encontrado' });
        }
        dashboard.tiempoPromedioVisita = tiempoPromedioVisita;
        await dashboard.save();

        res.status(200).json(dashboard);
    } catch (error) {
        res.status(500).json({ message: 'Error actualizando tiempoPromedioVisita', error });
    }
};

// Actualizar el campo totalCompartidos incrementándolo en 1
const incrementarTotalCompartidos = async (req, res) => {
    try {
        const dashboard = await Dashboard.findOne();
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard no encontrado' });
        }
        dashboard.totalCompartidos += 1;
        await dashboard.save();

        res.status(200).json(dashboard);
    } catch (error) {
        res.status(500).json({ message: 'Error incrementando totalCompartidos', error });
    }
};

// Actualizar el array compartidos
const actualizarCompartidos = async (req, res) => {
    const { compartido } = req.body;

    try {
        const dashboard = await Dashboard.findOne();
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard no encontrado' });
        }
        dashboard.compartidos.push(compartido);
        await dashboard.save();

        res.status(200).json(dashboard);
    } catch (error) {
        res.status(500).json({ message: 'Error actualizando compartidos', error });
    }
};

// Actualizar compartidos por plataforma
const actualizarCompartidosPorPlataforma = async (req, res) => {
    const { plataforma, categoria } = req.body;

    try {
        let dashboard = await Dashboard.findOne();
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard no encontrado' });
        }

        // Encuentra la plataforma correspondiente
        const plataformaData = dashboard.compartidosPorPlataforma.find(p => p.plataforma === plataforma);
        if (!plataformaData) {
            return res.status(404).json({ message: `Plataforma ${plataforma} no encontrada` });
        }

        // Encuentra la categoría correspondiente y aumenta su valor
        const categoriaData = plataformaData.categorias.find(c => c.nombre === categoria);
        if (!categoriaData) {
            return res.status(404).json({ message: `Categoría ${categoria} no encontrada en la plataforma ${plataforma}` });
        }
        categoriaData.valor += 1;

        await dashboard.save();
        res.status(200).json(dashboard);
    } catch (error) {
        res.status(500).json({ message: 'Error actualizando compartidos por plataforma', error });
    }
};


// Actualizar eventos asistidos
const actualizarEventosAsistidos = async (req, res) => {
    const { eventosAsistidos } = req.body;

    try {
        const dashboard = await Dashboard.findOne();
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard no encontrado' });
        }
        dashboard.eventosAsistidos = eventosAsistidos;
        await dashboard.save();

        res.status(200).json(dashboard);
    } catch (error) {
        res.status(500).json({ message: 'Error actualizando eventosAsistidos', error });
    }
};

// Actualizar estudiantes por sexo
const actualizarEstudiantesPorSexo = async (req, res) => {
    const { estudiantesPorSexo } = req.body;

    try {
        const dashboard = await Dashboard.findOne();
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard no encontrado' });
        }
        dashboard.estudiantesPorSexo = estudiantesPorSexo;
        await dashboard.save();

        res.status(200).json(dashboard);
    } catch (error) {
        res.status(500).json({ message: 'Error actualizando estudiantesPorSexo', error });
    }
};

// Añadir una nueva categoría a todas las plataformas
const anadirCategoriaATodasLasPlataformas = async (req, res) => {
    const nuevaCategoria = req.body.nuevaCategoria.nuevaCategoria;  // Asegúrate de que esto es una cadena
    try {
        const dashboard = await Dashboard.findOne();
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard no encontrado' });
        }

        // Asegúrate de que cada plataforma añada la nueva categoría como una cadena
        dashboard.compartidosPorPlataforma.forEach(plataforma => {
            const categoriaExistente = plataforma.categorias.find(c => c.nombre === nuevaCategoria);
            if (!categoriaExistente) {
                plataforma.categorias.push({
                    nombre: nuevaCategoria,
                    valor: 0
                });
            }
        });

        await dashboard.save();
        res.status(200).json(dashboard);
    } catch (error) {
        console.error('Error al añadir categoría a las plataformas:', error);
        res.status(500).json({ message: 'Error al añadir la nueva categoría a todas las plataformas', error });
    }
};

// Eliminar una categoría de todas las plataformas
const eliminarCategoriaDeTodasLasPlataformas = async (req, res) => {
    const { categoriaEliminada } = req.body;  // Asegúrate de que esto es una cadena
    try {
        const dashboard = await Dashboard.findOne();
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard no encontrado' });
        }

        // Recorre todas las plataformas y elimina la categoría
        dashboard.compartidosPorPlataforma.forEach(plataforma => {
            // Filtra las categorías para eliminar la especificada
            plataforma.categorias = plataforma.categorias.filter(c => c.nombre !== categoriaEliminada);
        });

        await dashboard.save();
        res.status(200).json({ message: `Categoría '${categoriaEliminada}' eliminada de todas las plataformas.` });
    } catch (error) {
        console.error('Error al eliminar la categoría de las plataformas:', error);
        res.status(500).json({ message: 'Error al eliminar la categoría de todas las plataformas', error });
    }
};

module.exports = {
    registrarEntrada,
    registrarSalida,
    obtenerTiempoPromedioVisita,
    obtenerDashboard,
    actualizarTotalCompartidos,
    actualizarTotalVisualizaciones,
    actualizarNuevosUsuarios,
    actualizarTiempoPromedioVisita,
    actualizarCompartidos,
    actualizarCompartidosPorPlataforma,
    actualizarEventosAsistidos,
    actualizarEstudiantesPorSexo,
    incrementarTotalCompartidos,
    anadirCategoriaATodasLasPlataformas,
    eliminarCategoriaDeTodasLasPlataformas,
};
