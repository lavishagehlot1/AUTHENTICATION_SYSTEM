import Joi from 'joi';
export const registerationSchema=Joi.object({
    userName:Joi.string().min(3).required(),
    userEmail:Joi.string().email().required(),
    password:Joi.string().min(6).required()
});

export const loginSchema=Joi.object({
    userEmail:Joi.string().email().required(),
    password:Joi.string().min(6).required()
})