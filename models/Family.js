import mongoose from 'mongoose';

const familySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  member_id: {
    type: String,
    required: true,
  },
  name: String,
  attributes: {
    DOB: Date,
  },
  children: [{
    member_id: String,
    name: String,
    attributes: {
      DOB: Date,
    },
    children: [{
      member_id: String,
      name: String,
      attributes: {
        DOB: Date,
      },
      children: [{
        member_id: String,
        name: String,
        attributes: {
          DOB: Date,
        },
      }],
    }],
  }],
});

const Family = mongoose.model('Family', familySchema, 'families');

export default Family;