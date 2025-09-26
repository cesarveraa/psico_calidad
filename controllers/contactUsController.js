import fs from 'fs';
import path from 'path';
import Page from "../models/Page";

const updateContactUs = async (req, res, next) => {
  const { slug } = req.params;

  try {
    const contactUs = await Page.findOne({ slug });
    if (!contactUs) {
      return res.status(404).json({ message: "Contact Us not found" });
    }

    console.log(req.body);

    const { title, description, faculty, photosToDelete } = req.body;

    contactUs.contact.title = title || contactUs.contact.title;
    contactUs.contact.description = description || contactUs.contact.description;
    contactUs.contact.faculty = faculty ? JSON.parse(faculty) : contactUs.contact.faculty;

    // Handle photo deletions
    if (photosToDelete) {
      const photosToDeleteArray = JSON.parse(photosToDelete);
      contactUs.contact.officeLocations = contactUs.contact.officeLocations.filter((photo) => {
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
    }

    // Update photos
    try {
      if (req.files && req.files.length > 0) {
        const newPhotos = req.files.map((file, index) => ({
          url: `/uploads/${file.filename}`,
          altText: req.body.photos[index].title || '',
          caption: req.body.photos[index].subtitle || '',
          caption: req.body.photos[index].address || '',
        }));
        contactUs.contact.officeLocations = [...contactUs.contact.officeLocations, ...newPhotos]; // Append new photos to existing photos
      }

      // Ensure we update altText and caption for all photos
      if (req.body.photos && Array.isArray(req.body.photos)) {
        contactUs.contact.officeLocations = contactUs.contact.officeLocations.map((photo, index) => ({
          ...photo,
          title: req.body.photos[index].title || photo.title,
          subtitle: req.body.photos[index].subtitle || photo.subtitle,
          address: req.body.photos[index].address || photo.address,
        }));
      }
    } catch (error) {
      console.log("Error parsing photos:", error.message);
      return res.status(400).json({ message: `Error parsing photos: ${error.message}` });
    }

    const updatedContactUs = await contactUs.save();
    res.json(updatedContactUs);
  } catch (error) {
    next(error);
  }
};

const getContactUs = async (req, res, next) => {
  try {
    const contactUs = await Page.findOne({ slug: req.params.slug });
    if (!contactUs) {
      return next(new Error("Contact Us not found"));
    }
    res.json(contactUs);
  } catch (error) {
    next(error);
  }
};

export { updateContactUs, getContactUs };
