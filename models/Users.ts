import mongoose from 'mongoose'

export interface users extends mongoose.Document {
    $oid: string
    email: string
    username: string
    password: string
    img: string
    rating: number
    statusText: string
    refresh_token: string,
    plus: number
    minus: number
    subscribers: Array<string>
}


/* PetSchema will correspond to a collection in your MongoDB database. */
const usersSchema = new mongoose.Schema<users>({

    email: {
        /* The owner of this pet */

        type: String,
        required: [true, "Please provide the pet owner's name"],
        maxlength: [60, "Owner's Name cannot be more than 60 characters"],
    },
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    password: {
        /* The species of your pet */

        type: String,
        required: [true, 'Please specify the species of your pet.'],
        maxlength: [40, 'Species specified cannot be more than 40 characters'],
    },
    img: {
        /* Pet's age, if applicable */

        type: String,
    },
    rating: {
        /* Boolean poddy_trained value, if applicable */

        type: Number,
    },
    statusText: {
        /* List of dietary needs, if applicable */

        type: String,
    },
    refresh_token: {

        type: String,
    },
    plus: {
        /* List of things your pet likes to do */

        type: Number,
    },
    minus: {
        /* List of things your pet does not like to do */

        type: Number,
    },
    subscribers: {
        /* List of things your pet does not like to do */

        type: [String],
    },
})

export default mongoose.models.Users || mongoose.model<users>('users', usersSchema)