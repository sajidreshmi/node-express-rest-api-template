import { Request, Response } from 'express'
import config from 'config'
import {
    createSession,
    findSessions,
    updateSession
} from '../service/session.service'
import { validatePassword } from '../service/user.service'
import { signJwt } from '../utils/jwt.utils'
export const createUserSessionHandler = async (req: Request, res: Response) => {
    try {
        //validate the user password
        const user = await validatePassword(req.body)

        if (!user) {
            return res.status(401).send('Invalid email or password')
        }
        //create a session
        const session = await createSession(
            user._id,
            req.get('user-agent') || ''
        )

        //create an access token
        const accessToken = signJwt(
            {
                ...user,
                session: session._id
            },
            { expiresIn: config.get('accessTokenTtl') }
        )
        //create a refresh token

        const refreshToken = signJwt(
            {
                ...user,
                session: session._id
            },
            { expiresIn: config.get('refreshTokenTtl') }
        )
        //return access and refresh token
        return res.send({ accessToken, refreshToken })
    } catch (error: any) {
        return res.status(500).send(error.message)
    }
}

export const getUserSessionHandler = async (req: Request, res: Response) => {
    const userId = res.locals.user._id

    const session = await findSessions({ user: userId, valid: true })

    return res.send(session)
}

export const deleteSessionHandler = async (req: Request, res: Response) => {
    const sessionId = res.locals.user.session

    await updateSession({ _id: sessionId }, { valid: false })

    return res.send({
        accessToken: null,
        refreshToken: null
    })
}
