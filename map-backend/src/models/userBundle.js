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
    buildingList: [],
    youtubeVideoId: String,
    address : { stringAddress : String, splitedAddress : [String] },
    recommend: {good: Number, bad: Number, username: [String]},
    estimate : { good: Number, interest: Number, accuracy: Number, total : Number, username : [String] },
});

const UserBundle = mongoose.model('userBundle', UserBundleSchema);

export default UserBundle;
