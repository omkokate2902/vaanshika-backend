import Family from '../models/Family.js';

export const createFamily = async (familyData) => {
  const newFamily = new Family(familyData);
  return await newFamily.save();
};