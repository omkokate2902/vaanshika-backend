import express from 'express';
import { addFamily, getFamilyByUserId, updateChild, deleteChild, deleteTree, addChild } from '../controllers/familyController.js';

const router = express.Router();

// Route to add family data
router.post('/', addFamily);

// Route to get family data by user_id
router.get('/', getFamilyByUserId);

// Route to add a child
router.post('/addChild', addChild);

// Route to delete a family member/child member 
router.delete('/deleteChild', deleteChild);

// Route to update a family member/child member
router.patch('/updateChild', updateChild);

// Route to delete a family tree
router.delete('/deleteTree', deleteTree);

export default router;