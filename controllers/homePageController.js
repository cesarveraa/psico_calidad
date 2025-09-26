import Page from "../models/Page";

const updateHomePage = async (req, res, next) => {
  const { slug } = req.params;

  try {
    const homepage = await Page.findOne({ slug });
    if (!homepage) {
      return res.status(404).json({ message: "Home Page not found" });
    }

    const { title, description, mision, vision, inscripciones, tarifario, planesPago, oportunidadesBeca, programaAgora } = req.body;

    // Actualizar los datos en el campo 'home'
    homepage.home.title = title || homepage.home.title;
    homepage.home.description = description || homepage.home.description;
    homepage.home.mision = mision || homepage.home.mision;
    homepage.home.vision = vision || homepage.home.vision;
    homepage.home.inscripciones.state = inscripciones.state;
    homepage.home.inscripciones.url = inscripciones.url || homepage.home.inscripciones.url;
    homepage.home.tarifario.state = tarifario.state;
    homepage.home.tarifario.url = tarifario.url || homepage.home.tarifario.url;
    homepage.home.planesPago.state = planesPago.state;
    homepage.home.planesPago.url = planesPago.url || homepage.home.planesPago.url;
    homepage.home.oportunidadesBeca.state = oportunidadesBeca.state;
    homepage.home.oportunidadesBeca.url = oportunidadesBeca.url || homepage.home.oportunidadesBeca.url;
    homepage.home.programaAgora.state = programaAgora.state;
    homepage.home.programaAgora.url = programaAgora.url || homepage.home.programaAgora.url;

    const updatedHomePage = await homepage.save();
    res.json(updatedHomePage);
  } catch (error) {
    next(error);
  }
};

const getHomePage = async (req, res, next) => {
  try {
    const homepage = await Page.findOne({ slug: req.params.slug });
    if (!homepage) {
      return next(new Error("Home Page not found"));
    }
    res.json(homepage);
  } catch (error) {
    next(error);
  }
};

export { updateHomePage, getHomePage };
