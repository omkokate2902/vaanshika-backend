import Family from '../models/Family.js';
import { createFamily } from '../services/familyService.js';

// ✅ POST: Add Family Tree Data
export const addFamily = async (req, res) => {
  try {
    const familyData = req.body;
    familyData.userId = req.user.userId; // ✅ Attach correct userId field

    await createFamily(familyData);
    res.status(201).json({ message: 'Tree saved' });
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({ error: 'User ID already exists.' });
    } else {
      console.error('Error adding family:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
};

// ✅ GET: Retrieve Family Tree Data by User ID
export const getFamilyByUserId = async (req, res) => {
  try {
    const family = await Family.findOne({ userId: req.user.userId });
    if (!family) return res.status(404).json({ error: 'Family not found' });

    res.json(family);
  } catch (error) {
    console.error('Error fetching family:', error.message);
    res.status(500).json({ error: 'Something went wrong!' });
  }
};

// ✅ PUT: Update Child Information
export const updateChild = async (req, res) => {
  const { member_id, updates } = req.body;

  try {
    const family = await Family.findOne({ userId: req.user.userId });
    if (!family) return res.status(404).json({ message: 'Family not found' });

    const updateChildById = (member, memberId, updates) => {
      if (member.member_id === memberId) {
        Object.assign(member, updates); // Update fields
        return true;
      }
      return member.children?.some((child) => updateChildById(child, memberId, updates));
    };

    const updated = updateChildById(family, member_id, updates);

    if (updated) {
      await family.save();
      res.status(200).json({ message: 'Child updated successfully' });
    } else {
      res.status(404).json({ message: 'Child not found' });
    }
  } catch (error) {
    console.error('Error updating child:', error.message);
    res.status(500).json({ message: 'An error occurred' });
  }
};

// ✅ DELETE: Remove Child from Family Tree
export const deleteChild = async (req, res) => {
  const { member_id } = req.body;

  try {
    const family = await Family.findOne({ userId: req.user.userId });
    if (!family) return res.status(404).json({ message: 'Family not found' });

    const deleteChildById = (member, memberId) => {
      if (!member.children) return false;

      const index = member.children.findIndex((child) => child.member_id === memberId);
      if (index !== -1) {
        member.children.splice(index, 1); // Remove child
        return true;
      }

      return member.children.some((child) => deleteChildById(child, memberId));
    };

    const deleted = deleteChildById(family, member_id);

    if (deleted) {
      await family.save();
      res.status(200).json({ message: 'Child deleted successfully' });
    } else {
      res.status(404).json({ message: 'Child not found' });
    }
  } catch (error) {
    console.error('Error deleting child:', error.message);
    res.status(500).json({ message: 'An error occurred' });
  }
};

// ✅ DELETE: Remove Entire Family Tree
export const deleteTree = async (req, res) => {
  try {
    const result = await Family.deleteOne({ userId: req.user.userId });
    if (result.deletedCount) {
      res.status(200).json({ message: 'Family tree deleted successfully' });
    } else {
      res.status(404).json({ message: 'Family tree not found' });
    }
  } catch (error) {
    console.error('Error deleting family tree:', error.message);
    res.status(500).json({ message: 'An error occurred' });
  }
};

// 🔄 Recursive Helper: Add Child to Family Tree
const addChildRecursive = (member, parentId, child) => {
  if (member.member_id === parentId) {
    child.member_id = `${parentId}.${member.children.length + 1}`; // Generate new member_id
    member.children.push(child);
    return true;
  }

  return member.children?.some((childMember) => addChildRecursive(childMember, parentId, child));
};

// ✅ POST: Add Child to Existing Member
export const addChild = async (req, res) => {
  const { parent_id, name, attributes } = req.body;

  try {
    const family = await Family.findOne({ userId: req.user.userId });
    if (!family) return res.status(404).json({ error: 'Family not found' });

    const newChild = { name, attributes, children: [] };
    const added = addChildRecursive(family, parent_id, newChild);

    if (!added) return res.status(404).json({ error: 'Parent not found' });

    await family.save();
    res.status(201).json({ message: 'Child added successfully', family });
  } catch (error) {
    console.error('Error adding child:', error.message);
    res.status(500).json({ error: error.message });
  }
};