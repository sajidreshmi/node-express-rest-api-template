import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import config from 'config'

export interface Session {
    user: SessionDocument['_id']
    valid: boolean
    userAgent: string
}

export interface SessionDocument extends Session, mongoose.Document {
    createdAt: Date
    updatedAt: Date
}

const sessionSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        valid: { type: Boolean, default: true },
        userAgent: { type: String }
    },
    {
        timestamps: true
    }
)

const SessionModel = mongoose.model('Session', sessionSchema)

export default SessionModel
