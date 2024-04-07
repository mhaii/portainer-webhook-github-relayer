import { Router } from 'express'

import MainController from '../controllers/Main'

const router = Router()

router.get('/', MainController.healthCheck)
router.post('/', MainController.webhook)

export default router
