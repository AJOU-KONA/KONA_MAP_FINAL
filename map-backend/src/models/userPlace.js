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

const UserPlace = mongoose.model('userMarker', UserPlaceSchema);

export default UserPlace;
