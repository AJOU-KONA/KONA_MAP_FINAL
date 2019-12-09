import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserPlaceSchema = new Schema({
    username: String,
    name: String,
    description: String,
    detailedPosition: String,
    tags: [String],
    position: {lat: Number, lng: Number},
    publishingDate: { type : Date, default: Date.now },
    primaryPositionType: String,
    secondaryPositionType: String,
    radius: Number,
    commentList: [],
    imageUrl : [String],
    block: Number,
    recommend: { good: Number, bad : Number, username: [String] },
    estimate : { good: Number, interest: Number, accuracy: Number, total : Number, username : [String] },
    youtubeVideoId: String,
    address : { stringAddress : String, splitedAddress : [String] }
});

UserPlaceSchema.statics.findByUsername = function(username){
    return this.find({username:username});
};

UserPlaceSchema.statics.findByType = function(primary){
    return this.find({primaryPositionType: primary});
};

UserPlaceSchema.statics.findByObjectID = function(id) {
    return this.find({_id: id});
};

const UserPlace = mongoose.model('userPlace', UserPlaceSchema);

export default UserPlace;
