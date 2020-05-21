import { Router } from 'express';
import adminUserController from '@controllers/adminuser.controller';
import { protect, authorize } from '@middlewares/auth.middleware';

const router = Router({ mergeParams: true });

router.use(protect);
router.use(authorize('admin'));

router.get('/', adminUserController.getUsers);
router.post('/', adminUserController.createUser);
router.get('/:id', adminUserController.getUser);
router.put('/:id', adminUserController.updateUser);
router.delete('/:id', adminUserController.deleteUser);

export default router;
