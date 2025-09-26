const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/dashboardController');

// Rutas para visitas
router.post('/entrar', registrarEntrada);
router.post('/salir', registrarSalida);
router.get('/tiempo-promedio-visita', obtenerTiempoPromedioVisita);

// Ruta para obtener todos los datos del dashboard
router.get('/', obtenerDashboard);

// Rutas para actualizar campos del dashboard
router.put('/total-compartidos', actualizarTotalCompartidos);
router.put('/total-visualizaciones', actualizarTotalVisualizaciones);
router.put('/nuevos-usuarios', actualizarNuevosUsuarios);
router.put('/tiempo-promedio-visita', actualizarTiempoPromedioVisita);
router.put('/total-compartidos/increment', incrementarTotalCompartidos);
router.put('/compartidos', actualizarCompartidos);
router.put('/compartidos-por-plataforma', actualizarCompartidosPorPlataforma);
router.put('/eventos-asistidos', actualizarEventosAsistidos);
router.put('/estudiantes-por-sexo', actualizarEstudiantesPorSexo);
router.put('/anadir-categoria-todas-plataformas', anadirCategoriaATodasLasPlataformas);
router.delete('/eliminar-categoria', eliminarCategoriaDeTodasLasPlataformas);

module.exports = router;
