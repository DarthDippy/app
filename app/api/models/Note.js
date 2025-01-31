import { model, models, Schema } from "mongoose";
import PermissionSchema from "./PermissionSchema";

// Should add option to link to videos/images instead of text
// Captions will be required in those cases

import MAX from "@/lib/max";
import SourceReferenceSchema from "./SourceReferenceSchema";
// Don't forget to validate at least one source ID

const NoteSchema = new Schema(
    {
        title: {
            type: String,
            required: false,
            maxLength: MAX.title
        },
        text: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: MAX.noteText,
        },
        tags: [
            {
                type: String,
                minLength: 1,
                maxLength: MAX.tag,
            },
        ],
        courses: [
            {
                type: Schema.Types.ObjectId,
                ref: "course"
            }
        ],
        sources: [
            {
                type: Schema.Types.ObjectId,
                ref: "source",
            },
        ],
        sourceReferences: [
            {
                type: SourceReferenceSchema
            }
        ],
        contributors: [
            {
                type: Schema.Types.ObjectId,
                ref: "user",
            },
        ],
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        permissions: PermissionSchema,
    },
    {
        timestamps: true,
    },
);

NoteSchema.set("toJSON", {
    virtuals: true,
});

export default models?.note || model("note", NoteSchema);
