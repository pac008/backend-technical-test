import { Router } from 'express';
import { targetCoordinates } from '../controllers/droid.controller';


const router = Router()


router.post('/radar', targetCoordinates )



export default router;