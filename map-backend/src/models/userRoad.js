import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserRoadSchema = new Schema({
    username: String,
    name: String,
    description: String,
    detailedPosition: String,
    tags: [String],
    publishingDate: { type : Date, default: Date.now },
    primaryPositionType: String,
    secondaryPositionType: String,
    commentList: [],
    roadInfo: Object,
    imageUrl: [String],
    block: Number,
});

UserRoadSchema.statics.findByUsername = function(username){
    return this.find({username: username})
};


const UserRoad = mongoose.model('userRoad', UserRoadSchema);

export default UserRoad;
