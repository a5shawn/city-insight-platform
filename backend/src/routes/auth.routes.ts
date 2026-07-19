import { Router } from 'express'
import * as authController from '../controllers/auth.controller'

export const authRouter = Router()

// POST /api/auth/register
authRouter.post('/register', authController.register)

// POST /api/auth/login
authRouter.post('/login', authController.login)
