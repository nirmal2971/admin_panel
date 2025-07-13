import { Response } from 'express';
import User from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';

export const getAllUsers = async (_req: AuthRequest, res: Response) => {
  const users = await User.find().select('-password');
  res.json(users);
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  await user.deleteOne();
  res.json({ message: 'User deleted' });
};
