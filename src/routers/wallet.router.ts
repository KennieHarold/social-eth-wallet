import { Router } from 'express';
import { createWallet } from '@/controllers/wallet.controller';
import { isLoggedIn } from './middlewares/auth.middleware';

const router = Router();

router.post('/', isLoggedIn, createWallet);

export default router;
