import { Router } from 'express'

import MainController from '../controllers/Main'

const router = Router()

router.post('/', MainController.index)

export default router
