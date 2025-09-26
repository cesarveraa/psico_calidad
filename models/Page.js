import mongoose from 'mongoose';
import AboutUsSchema from './About';
import ContactUsSchema from './ContactUs';
import HomePageSchema from './HomePage';
import Sce from './Sce';
import Za from './zonaAprendizaje';


const { Schema, model } = mongoose;

const PageSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    home: { type: HomePageSchema, required: false },
    contact: { type: ContactUsSchema, required: false },
    about: { type: AboutUsSchema, required: false },
    sce: { type: Sce, required: false },
    za: { type: Za, required: false },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

const Page = model('Page', PageSchema);

export default Page;
