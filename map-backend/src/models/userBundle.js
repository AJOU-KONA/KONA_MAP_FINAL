import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserBundleSchema = new Schema({
    username: String,
    name: String,
    description: String,
    detailedPosition: String,
    tags: [String],
    publishingDate: { type : Date, default: Date.now },
    primaryPositionType: String,
    secondaryPositionType: String,
    commentList: [],
    placeList: [],
    roadList: [],
    buildingList: []
});

const UserBundle = mongoose.model('userBundle', UserBundleSchema);

export default UserBundle;
