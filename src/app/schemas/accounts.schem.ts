import * as Joi from 'joi'
import { User } from '../entities/user.entity'
/**
 * @register
 */
const schema1 = Joi.object<User>({
    username: Joi.string()
        .min(3)
        .max(30)
        .required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    nickname: Joi.string()
})