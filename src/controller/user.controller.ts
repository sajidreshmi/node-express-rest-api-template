import { Request, Response } from 'express'
import { CreateUserInput } from '../schema/user.schema'
import { createUser } from '../service/user.service'
import logger from '../utils/logger'
import { omit } from 'lodash'

export const createUserHandler = async (
    req: Request<{}, {}, CreateUserInput['body']>,
    res: Response
) => {
    try {
        const user = await createUser(req.body) //call create user service
        return res.send(omit(user.toJSON(), 'password'))
    } catch (error: any) {
        logger.error(error)
        return res.status(409).send(error.message)
    }
}
