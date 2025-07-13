import express from 'express';
import { getAllUsers, deleteUser } from '../Controllers/userController';
import protect from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, getAllUsers);
router.delete('/:id', protect, deleteUser);

export default router;
