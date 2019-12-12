import mongoose from 'mongoose';

const { Schema } = mongoose;

const BuildingSchema = new Schema({
    username: String,
    name: String,
    description: String,
    detailedPosition: String,
    tags: [String],
    type: {point : Boolean, rectangle : Boolean, cicle : Boolean },
    publishingDate: { type : Date, default: Date.now },
    primaryPositionType: String,
    secondaryPositionType: String,
    radius: Number,
    commentList: [],
    block: Number,
    recommend: { good: Number, bad : Number, username: [String] },
    // 유용함, 흥미로움, 신뢰도, 종합
    estimate : { good: Number, interest: Number, accuracy: Number, total : Number, username : [String] },
    youtubeVideoId: String,
    buildingPosition: [],
    floor : Number,
    floorArray: [],
    address : { stringAddress : String, splitedAddress : [String] }
});

BuildingSchema.statics.findByUsername = function(username){
    return this.find({username});
};

BuildingSchema.statics.findByObjectID = function(objectID){
    return this.findById({objectID});
};

const UserBuilding = mongoose.model('UserBuilding', BuildingSchema);

export default UserBuilding;
