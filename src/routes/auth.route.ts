import { Router } from 'express';
import authController from '@controllers/auth.controller';
import { protect } from '@middlewares/auth.middleware';

const router = Router({ mergeParams: true });

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', protect, authController.getMe);
router.get('/updatedetails', protect, authController.updateDetails);
router.get('/updatepassword', protect, authController.updatePassword);
router.post('/forgotpassword', authController.forgotPassword);
router.put('/resetpassword/:resettoken', authController.resetPassword);

export default router;
