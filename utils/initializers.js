import Page from '../models/Page';
import Product from '../models/Productos';
import ProductCategories from '../models/productCategories';
import Dashboard from '../models/Dashboard';
import PostCategories from '../models/PostCategories';
import PulpiComentarios from '../models/PulpiComentarios';

const initializeAboutUs = async () => {
    try {
        const aboutExists = await Page.findOne({ slug: 'about' });
        if (!aboutExists) {
            const newAbout = new Page({
                slug: 'about',
                about: {
                    title: 'Sobre nosotros',
                    description: 'Bienvenidos a nuestra página acerca de nosotros. Aquí encontrarás información sobre nuestro equipo.',
                    body: {
                        text: 'Este es un sobre nosotros predeterminado, por favor actualízame.',
                    },
                    faculty: [
                        '6631088cd24fb56a65df8ce8',
                        '6631088cd24fb56a65df8ce5',
                    ],
                    photos: [
                        {
                            url: 'https://ucblpz.com/wp-content/uploads/2020/04/Psicopedagogi%CC%81a.jpg',
                            altText: 'Nuestra Institución',
                            caption: 'Vista frontal del edificio principal.'
                        },
                        {
                            url: 'https://ucblpz.com/wp-content/uploads/2020/04/Psicopedagogi%CC%81a.jpg',
                            altText: 'Nuestra Institución',
                            caption: 'Vista frontal del edificio principal.'
                        },
                        // ... more photos ...
                    ],
                    videos: [
                        {
                            url: 'https://www.youtube.com/watch?v=OUd-tTZWBNw',
                            title: 'Video Promocional',
                            description: 'Un vistazo a nuestras instalaciones y lo que ofrecemos.'
                        },
                        {
                            url: 'https://www.youtube.com/watch?v=OUd-tTZWBNw',
                            title: 'Video Promocional',
                            description: 'Un vistazo a nuestras instalaciones y lo que ofrecemos.'
                        },
                        // ... more videos ...
                    ],
                }
            });
            await newAbout.save();
            console.log('Default About Us created successfully.');
        } else {
            console.log('Default About Us already exists.');
        }
    } catch (error) {
        console.error('Error initializing the About Us document:', error);
    }
};

const initializeContactUs = async () => {
    try {
        const contactExists = await Page.findOne({ slug: 'contact' });
        if (!contactExists) {
            const newContactUs = new Page({
                slug: 'contact',
                contact: {
                    title: 'Contact Us',
                    description: 'Here is how you can reach out to us. Please use the information below to contact us.',
                    officeLocations: [
                        {
                            url: '/uploads/1716603350622-wallpaperbetter.com_1920x1080.jpg',
                            address: '123 Main St, Suite 101',
                            title: 'Main Office',
                            subtitle: 'Headquarters'
                        },
                        {
                            url: '/uploads/1716603350622-wallpaperbetter.com_1920x1080.jpg',
                            address: '456 Elm St, Suite 202',
                            title: 'Branch Office',
                            subtitle: 'Regional Office'
                        }
                    ],
                    faculty: [
                        '6631088cd24fb56a65df8ce8',
                        '6631088cd24fb56a65df8ce5',
                    ],
                }
            });
            await newContactUs.save();
            console.log('Default Contact Us created successfully.');
        } else {
            console.log('Default Contact Us already exists.');
        }
    } catch (error) {
        console.error('Error initializing the Contact Us document:', error);
    }
};

const initializeHomePage = async () => {
    try {
        const homePageExists = await Page.findOne({ slug: 'home' });
        if (!homePageExists) {
            const newHomePage = new Page({
                slug: 'home',
                home: {
                    title: '¡BIENVENIDO A PSICOPEDAGOGIA!',
                    description: 'La Psicopedagogía es el viaje perfecto si te apasiona entender cómo aprendemos y nos desarrollamos. En esta carrera, combinas la psicología y la pedagogía para ayudar a superar dificultades de aprendizaje y potenciar el desarrollo de niños, adolescentes y adultos. Es una oportunidad única para ser un agente de cambio en la educación y contribuir a sociedades más inclusivas.',
                    mision: 'Nuestra misión es proporcionar una educación de calidad.',
                    vision: 'Nuestra visión es ser una institución líder en innovación educativa.',
                    inscripciones: {
                        state: true,
                        url: 'https://lpz.ucb.edu.bo/inscripciones-estudiantes-nuevos/'
                    },
                    tarifario: {
                        state: true,
                        url: 'https://lpz.ucb.edu.bo/estudiantes/tarifario-oficial/'
                    },
                    planesPago: {
                        state: true,
                        url: 'https://cajap.ucb.edu.bo/UCBPagosWeb/Default.aspx'
                    },
                    oportunidadesBeca: {
                        state: true,
                        url: 'https://lpz.ucb.edu.bo/becas/'
                    },
                    programaAgora: {
                        state: true,
                        url: 'https://lpz.ucb.edu.bo/agora/'
                    },
                }
            });
            await newHomePage.save();
            console.log('Default Home Page created successfully.');
        } else {
            console.log('Default Home Page already exists.');
        }
    } catch (error) {
        console.error('Error initializing the Home Page document:', error);
    }
};

const initializeSCE = async () => {
    try {
        const sceExists = await Page.findOne({ slug: 'sce' });
        if (!sceExists) {
            const newSCE = new Page({
                slug: 'sce',
                sce: {
                    quienesSomos: 'Somos una prestigiosa organización interdisciplinaria fundada en 2010 con el objetivo de fomentar la pasión y el desarrollo en las ciencias entre estudiantes universitarios. Con capítulos en más de cien universidades a nivel mundial, la SCE se dedica a cultivar un entorno académico donde los jóvenes científicos puedan explorar, investigar y contribuir al avance científico de forma significativa.',
                    comoUnirse: [
                        {
                            order: 1,
                            title: 'Registro Preliminar:',
                            description: 'Completa el "Formulario de Intenciones Exploratorias" en la web de La Liga y escribe un ensayo sobre "Por qué quiero explorar la ciencia con La Liga"',
                        },
                        {
                            order: 2,
                            title: 'Prueba de Conocimiento Científico:',
                            description: 'Supera la "Prueba de Conocimiento Universal Científico (PCUC)", que incluye preguntas de varias disciplinas científicas.',
                        },
                        {
                            order: 3,
                            title: 'Ritual de Iniciación:',
                            description: 'Participa en el Ritual de Iniciación en el "Gran Laboratorio", donde crearás una "Poción de Compromiso" y pronunciarás el "Juramento del Explorador".',
                        },
                        {
                            order: 4,
                            title: 'Entrevista con el Consejo de Sabios:',
                            description: 'Discute un proyecto científico innovador en una entrevista con el Consejo de Sabios, compuesto por estudiantes avanzados y profesores.',
                        },
                        {
                            order: 5,
                            title: 'Ceremonia de Aceptación y Misión Inicial:',
                            description: 'Si eres aceptado, recibirás la "Toga del Explorador" en una ceremonia especial y deberás completar una "Misión Inicial" para demostrar tus habilidades científicas.',
                        }
                    ],
                    desdeCuandoExiste: 'Desde cuando existe SCE',
                    dataGroup: 'Grupo de datos',
                    quienesConforman: 'Personas que conforman SCE',
                    members: [
                        '663289d385e73928666f6aec',
                        '663289d385e73928666f6aed',
                    ],
                    accionesInvestigativas: [
                        {
                            url: '/uploads/1716603350622-wallpaperbetter.com_1920x1080.jpg',
                            title: 'Investigación 1',
                            subtitle: 'Subtítulo 1',
                            description: 'Descripción de la investigación 1'
                        }
                    ],
                    presenteInvestigacion: [
                        {
                            url: '/uploads/1716603350622-wallpaperbetter.com_1920x1080.jpg',
                            title: 'Investigación Presente 1',
                            description: 'Descripción de la investigación presente 1'
                        }
                    ]
                }
            });
            await newSCE.save();
            console.log('Default SCE created successfully.');
        } else {
            console.log('Default SCE already exists.');
        }
    } catch (error) {
        console.error('Error initializing the SCE document:', error);
    }
};

const initializeZA = async () => {
    try {
        const zaExists = await Page.findOne({ slug: 'za' });
        if (!zaExists) {
            const newSCE = new Page({
                slug: 'za',
                za: {
                    quienesSomos: 'Zona de Aprendizaje es una innovadora iniciativa educativa fundada en 2015, diseñada para potenciar el aprendizaje autodirigido y colaborativo entre estudiantes de todos los niveles educativos.',
                    comoUnirse: [
                        {
                            order: 1,
                            title: 'Registro Online:',
                            description: 'Completa el formulario en línea y adjunta una carta de motivación explicando tus metas y cómo la Zona de Aprendizaje puede ayudarte a alcanzarlas.',
                        },
                        {
                            order: 2,
                            title: 'Evaluación de Aptitudes:',
                            description: 'Realiza un test de aptitudes online para evaluar tus habilidades relevantes y participa en una breve entrevista virtual.',
                        },
                        {
                            order: 3,
                            title: 'Taller de Inmersión:',
                            description: 'Asiste a un taller de medio día para participar en actividades prácticas y recibir feedback sobre tu capacidad de aprendizaje colaborativo.',
                        },
                        {
                            order: 4,
                            title: 'Notificación de Admisión:',
                            description: 'Recibe un correo electrónico con la decisión del comité y, si es positiva, sigue las instrucciones para formalizar tu inscripción.',
                        }
                    ],
                    desdeCuandoExiste: 'Desde cuando existe ZA',
                    dataGroup: 'Grupo de datos',
                    quienesConforman: 'Personas que conforman ZA',
                    members: [
                        '663289d385e73928666f6aec',
                        '663289d385e73928666f6aed',
                    ],
                    accionesInvestigativas: [
                        {
                            url: '/uploads/1716603350622-wallpaperbetter.com_1920x1080.jpg',
                            title: 'Investigación 1',
                            subtitle: 'Subtítulo 1',
                            description: 'Descripción de la investigación 1'
                        }
                    ],
                    presenteInvestigacion: [
                        {
                            url: '/uploads/1716603350622-wallpaperbetter.com_1920x1080.jpg',
                            title: 'Investigación Presente 1',
                            description: 'Descripción de la investigación presente 1'
                        }
                    ]
                }
            });
            await newSCE.save();
            console.log('Default ZA created successfully.');
        } else {
            console.log('Default ZA already exists.');
        }
    } catch (error) {
        console.error('Error initializing the ZA document:', error);
    }
};

const initializeProducts = async () => {
    try {
        const productsExist = await Product.findOne();
        if (!productsExist) {
            const defaultProducts = [
                {
                    imageUrl: [
                        'https://example.com/image1.jpg',
                        'https://example.com/image2.jpg'
                    ],
                    name: 'Producto Ejemplo 1',
                    price: 19.99,
                    description: 'Descripción del producto ejemplo 1.',
                    categories: [
                        '665408827fca8a63e18a8557',
                        '665408827fca8a63e18a8558',
                    ],
                    stock: 50
                }
            ];

            await Product.insertMany(defaultProducts);
            console.log('Default products created successfully.');
        } else {
            console.log('Default products already exist.');
        }
    } catch (error) {
        console.error('Error initializing the products:', error);
    }
};

const initializeProductCategories = async () => {
    try {
        const categoriesExist = await ProductCategories.findOne();
        if (!categoriesExist) {
            const defaultCategories = [
                { title: 'Electrónica' },
                { title: 'Ropa' },
                { title: 'Hogar' },
                { title: 'Libros' },
                { title: 'Juguetes' }
            ];

            await ProductCategories.insertMany(defaultCategories);
            console.log('Default categories created successfully.');
        } else {
            console.log('Default categories already exist.');
        }
    } catch (error) {
        console.error('Error initializing the categories:', error);
    }
};

const initializeDashboard = async () => {
    try {
        const dashboardExists = await Dashboard.findOne();
        if (!dashboardExists) {
            const categories = await PostCategories.find().select('title');

            const platforms = ['Facebook', 'WhatsApp', 'Twitter'];

            const compartidosPorPlataforma = platforms.map(platform => ({
                plataforma: platform,
                categorias: categories.map(category => ({
                    nombre: category.title,
                    valor: 0
                }))
            }));

            const newDashboard = new Dashboard({
                totalCompartidos: 0,
                previousTotalCompartidos: 0,
                totalVisualizaciones: 0,
                previousTotalVisualizaciones: 0,
                nuevosUsuarios: 0,
                previousNuevosUsuarios: 0,
                tiempoPromedioVisita: 0,
                previousTiempoPromedioVisita: 0,
                compartidosPorPlataforma,
                compartidos: [],
                estudiantesPorSexo: [
                    { sexo: 'mujeres', valor: 0 },
                    { sexo: 'hombres', valor: 0 }
                ],
                eventosAsistidos: {
                    total: 0
                }
            });

            await newDashboard.save();
            console.log('Default Dashboard created successfully.');
        } else {
            console.log('Default Dashboard already exists.');
        }
    } catch (error) {
        console.error('Error initializing the Dashboard document:', error);
    }
};

const initializePulpiComentarios = async () => {
    try {
        const exists = await PulpiComentarios.findOne();
        if (!exists) {
            const comentarios = [
                {
                    comentario: "¡Hola! Soy Pulpi, la mascota de la carrera de Psicopedagogía. ¡Estoy aquí para apoyarte en tu camino educativo!"
                },
                {
                    comentario: "Recuerda que siempre puedes consultarme sobre las actividades y recursos de nuestra carrera."
                },
                {
                    comentario: "¿Sabías que la Psicopedagogía es esencial para entender los procesos de aprendizaje y desarrollo? ¡Aprende más con nosotros!"
                },
                {
                    comentario: "No olvides revisar nuestro calendario de eventos para que no te pierdas de nuestras actividades."
                },
                {
                    comentario: "Si necesitas ayuda o tienes alguna pregunta, ¡no dudes en escribirme!"
                }
            ];

            await PulpiComentarios.insertMany(comentarios);
            console.log('Comentarios de Pulpi inicializados correctamente.');
        } else {
            console.log('Los comentarios de Pulpi ya han sido inicializados.');
        }
    } catch (error) {
        console.error('Error al inicializar los comentarios de Pulpi:', error);
    }
};


export { initializeAboutUs, initializeContactUs, initializeHomePage, initializeSCE, initializeZA, initializeProducts, initializeProductCategories, initializeDashboard, initializePulpiComentarios };