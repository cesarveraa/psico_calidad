import fs from 'fs';
import path from 'path';
import Page from "../models/Page";

const updateSCE = async (req, res, next) => {
  const { slug } = req.params;

  try {
    const page = await Page.findOne({ slug });
    if (!page || !page.sce) {
      return res.status(404).json({ message: "Page or SCE not found" });
    }
console.log(req.files);
console.log(req.body);
    const {
      quienesSomos, comoUnirse, desdeCuandoExiste,
      dataGroup, quienesConforman, members, photosToDelete
    } = req.body;

    const sce = page.sce;

    // Update basic fields
    sce.quienesSomos = quienesSomos || sce.quienesSomos;
    sce.desdeCuandoExiste = desdeCuandoExiste || sce.desdeCuandoExiste;
    sce.dataGroup = dataGroup || sce.dataGroup;
    sce.quienesConforman = quienesConforman || sce.quienesConforman;

    // Handle members
    if (members) {
      sce.members = JSON.parse(members);
    }

    // Handle comoUnirse updates
    if (comoUnirse) {
      sce.comoUnirse = JSON.parse(comoUnirse).map((step, index) => ({
        order: step.order || index + 1,
        title: step.title,
        description: step.description
      }));
    }

    // Handle photo deletions
    if (photosToDelete) {
      const photosToDeleteArray = JSON.parse(photosToDelete);
      const deletePhotos = (photosArray) => {
        return photosArray.filter((photo) => {
          const shouldDelete = photosToDeleteArray.some((delPhoto) => delPhoto.url === photo.url);
          if (shouldDelete) {
            const photoPath = path.join(__dirname, `../uploads/${path.basename(photo.url)}`);
            fs.unlink(photoPath, (err) => {
              if (err) {
                console.error(`Failed to delete local file: ${photoPath}`, err);
              } else {
                console.log(`Successfully deleted local file: ${photoPath}`);
              }
            });
          }
          return !shouldDelete;
        });
      };

      sce.accionesInvestigativas = deletePhotos(sce.accionesInvestigativas);
      sce.presenteInvestigacion = deletePhotos(sce.presenteInvestigacion);
    }

    // Update photos
    try {
      if (req.files.accionesInvestigativasP || req.files.presenteInvestigacionP) {
        const newAccionesInvestigativasPhotos = [];
        const newPresenteInvestigacionPhotos = [];

        if (req.files.accionesInvestigativasP) {
          req.files.accionesInvestigativasP.forEach((file) => {
            const photoData = {
              url: `/uploads/${file.filename}`,
              title: req.body[`accionesInvestigativasP[${file.originalname}][title]`] || '',
              subtitle: req.body[`accionesInvestigativasP[${file.originalname}][subtitle]`] || '',
              description: req.body[`accionesInvestigativasP[${file.originalname}][description]`] || ''
            };
            newAccionesInvestigativasPhotos.push(photoData);
          });
          sce.accionesInvestigativas = [...sce.accionesInvestigativas, ...newAccionesInvestigativasPhotos];
        }
        
        // Esta parte del codigo comentada es la forma de como manejar la segunda seccion de imagenes

        // if (req.files.presenteInvestigacionP) {
        //   req.files.presenteInvestigacionP.forEach((file) => {
        //     const photoData = {
        //       url: `/uploads/${file.filename}`,
        //       title: req.body[`presenteInvestigacionP[${file.originalname}][title]`] || '',
        //       description: req.body[`presenteInvestigacionP[${file.originalname}][description]`] || ''
        //     };
        //     newPresenteInvestigacionPhotos.push(photoData);
        //   });
        //   sce.presenteInvestigacion = [...sce.presenteInvestigacion, ...newPresenteInvestigacionPhotos];
        // }
        if (req.files.presenteInvestigacionP) {
          const newPresenteInvestigacionPhoto = req.files.presenteInvestigacionP[0];
          const photoData = {
            url: `/uploads/${newPresenteInvestigacionPhoto.filename}`,
            title: req.body[`presenteInvestigacionP[0][title]`] || '',
            description: req.body[`presenteInvestigacionP[0][description]`] || ''
          };

          // Delete the previous photo if it exists
          if (sce.presenteInvestigacion.length > 0) {
            const oldPhoto = sce.presenteInvestigacion[0];
            const oldPhotoPath = path.join(__dirname, `../uploads/${path.basename(oldPhoto.url)}`);
            fs.unlink(oldPhotoPath, (err) => {
              if (err) {
                console.error(`Failed to delete old photo: ${oldPhotoPath}`, err);
              } else {
                console.log(`Successfully deleted old photo: ${oldPhotoPath}`);
              }
            });
          }

          // Replace the existing image with the new one
          sce.presenteInvestigacion = [photoData];
        }
      }

      // Ensure we update title, subtitle, and description for all photos
      const updatePhotoDetails = (section) => {
        return sce[section].map((photo, index) => {
          const sectionPhotos = req.body[`${section}P`] || [];
          const updatedPhoto = sectionPhotos[index] || {};
          return {
            ...photo,
            title: updatedPhoto.title || photo.title,
            subtitle: updatedPhoto.subtitle || photo.subtitle,
            description: updatedPhoto.description || photo.description,
          };
        });
      };

      sce.accionesInvestigativas = updatePhotoDetails('accionesInvestigativas');
      sce.presenteInvestigacion = updatePhotoDetails('presenteInvestigacion');
    } catch (error) {
      console.log("Error parsing photos:", error.message);
      return res.status(400).json({ message: `Error parsing photos: ${error.message}` });
    }

    const updatedSCE = await page.save();
    res.json(updatedSCE);
  } catch (error) {
    next(error);
  }
};

const getSCE = async (req, res, next) => {
  try {
    const sce = await Page.findOne({ slug: req.params.slug });
    if (!sce) {
      return next(new Error("Contact Us not found"));
    }
    res.json(sce);
  } catch (error) {
    next(error);
  }
};

export { updateSCE, getSCE };
