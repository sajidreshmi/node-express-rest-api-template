import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import config from 'config'

export interface UserInput {
    email: string
    name: string
    password: string
}

export interface UserDocument extends UserInput, mongoose.Document {
    createdAt: Date
    updatedAt: Date
    comparePassword(candidatePassword: string): Promise<Boolean>
}

const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        password: { type: String, required: true }
    },
    {
        timestamps: true
    }
)

userSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    const user: UserDocument = this as UserDocument

    return bcrypt.compare(candidatePassword, user.password).catch((e) => false)
}

userSchema.pre('save', async function (next) {
    const user: UserDocument = this as UserDocument

    if (!user.isModified('password')) {
        return next()
    }

    const salt = await bcrypt.genSalt(config.get<number>('saltWorkFactor'))

    const hash = await bcrypt.hashSync(user.password, salt)

    user.password = hash

    return next()
})

const UserModel = mongoose.model<UserDocument>('User', userSchema)

export default UserModel
