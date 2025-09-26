import fs from 'fs';
import path from 'path';
import Page from "../models/Page";

const updateAbout = async (req, res, next) => {
  const { slug } = req.params;

  try {
    const about = await Page.findOne({ slug });
    if (!about) {
      return res.status(404).json({ message: "Page Us not found" });
    }

    const { title, description, body, faculty, photosToDelete } = req.body;

    about.about.title = title || about.about.title;
    about.about.description = description || about.about.description;
    about.about.body = body ? JSON.parse(body) : about.about.body;
    about.about.faculty = faculty ? JSON.parse(faculty) : about.about.faculty;

    // Handle photo deletions
    if (photosToDelete) {
      const photosToDeleteArray = JSON.parse(photosToDelete);
      about.about.photos = about.about.photos.filter((photo) => {
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
          altText: req.body.photos[index].altText || '',
          caption: req.body.photos[index].caption || '',
        }));
        about.about.photos = [...about.about.photos, ...newPhotos]; // Append new photos to existing photos
      }

      // Ensure we update altText and caption for all photos
      if (req.body.photos && Array.isArray(req.body.photos)) {
        about.about.photos = about.about.photos.map((photo, index) => ({
          ...photo,
          altText: req.body.photos[index].altText || photo.altText,
          caption: req.body.photos[index].caption || photo.caption,
        }));
      }
    } catch (error) {
      console.log("Error parsing photos:", error.message);
      return res.status(400).json({ message: `Error parsing photos: ${error.message}` });
    }

    // Update videos
    try {
      if (req.body.videos) {
        const parsedVideos = JSON.parse(req.body.videos);
        if (!Array.isArray(parsedVideos)) {
          throw new Error("Videos is not an array");
        }
        about.about.videos = parsedVideos.map((video, index) => {
          if (typeof video !== 'object' || !video.url || !video.title || !video.description) {
            throw new Error(`Invalid video object at index ${index}`);
          }
          return {
            url: video.url,
            title: video.title,
            description: video.description,
          };
        });
      }
    } catch (error) {
      console.log("Error parsing videos:", error.message);
      return res.status(400).json({ message: `Error parsing videos: ${error.message}` });
    }

    const updatedAbout = await about.save();
    res.json(updatedAbout);
  } catch (error) {
    next(error);
  }
};

const getAbout = async (req, res, next) => {
  try {
    const about = await Page.findOne({ slug: req.params.slug });
    if (!about) {
      return next(new Error("Page Us not found"));
    }
    res.json(about);
  } catch (error) {
    next(error);
  }
};

export { updateAbout, getAbout };
