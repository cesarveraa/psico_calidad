import { Schema } from "mongoose";

const zaSchema = new Schema(
    {
        quienesSomos: { type: String, required: true },
        desdeCuandoExiste: { type: String, required: false },
        dataGroup: { type: String, required: false },
        quienesConforman: { type: String, required: false },
        members: [{ type: Schema.Types.ObjectId, ref: "Estudiante" }],
        comoUnirse: [
            {
                order: { type: Number, required: true },
                title: { type: String, required: false },
                description: { type: String, required: false },
            }],
        accionesInvestigativas: [
            {
                url: { type: String, required: true },
                title: { type: String, required: false },
                subtitle: { type: String, required: false },
                description: { type: String, required: false },
            }
        ],
        presenteInvestigacion: [
            {
                url: { type: String, required: true },
                title: { type: String, required: false },
                description: { type: String, required: false },
            }
        ],
    },
    { timestamps: true, toJSON: { virtuals: true } }
);

export default zaSchema;
