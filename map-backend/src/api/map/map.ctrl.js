import UserPlace from "../../models/userPlace"
import Post from "../../models/post";
import Comment from "../../models/comment";
import UserRoad from "../../models/userRoad";
import sanitizeHtml from "sanitize-html";
import UserBundle from "../../models/userBundle";
import UserBuilding from "../../models/building";

const post = new Post([
    {
        title: "title1",
        body: "body1",
        tags: ["tags1", "tags2", "tags3"],
        publishingDate: { type : Date, default: Date.now },
        user: {
            username: "user1",
        }
    },
    {
        title: "title2",
        body: "body2",
        tags: ["tags4", "tags5", "tags6"],
        publishingDate: { type : Date, default: Date.now },
        user: {
            username: "user2",
        },
    },
]);

const userPlaceList = new UserPlace([
    {
        name: "첫번쨰 이름",
        description: "첫번째 설명",
        tags: ["태그1", "태그2"],
        position: {lat: 30, lng: 123},
        posts: post,
    },
]);

exports.makeUserPlace = async ctx => {
    const { username, name, description, tags, position, detailedPosition, publishingDate,
    primaryPositionType, secondaryPositionType, radius, imageUrl, youtubeUrl } = ctx.request.body;

    let index = youtubeUrl.indexOf('v=');
    let youtubeVideoId = youtubeUrl.substring(index+2, youtubeUrl.length);
    const userPlace = new UserPlace({
        username, name, description, tags, position, detailedPosition, publishingDate,
        primaryPositionType, secondaryPositionType, radius, imageUrl, block: 0,
        recommend : {good: 0, bad: 0, username: []}, youtubeVideoId
    });
    try{
        await userPlace.save();
        ctx.body = userPlace;
    } catch(e) {
        ctx.throw(500, e);
    }
};

exports.listUserPlace = async ctx => {
    try{
        const userplace = await UserPlace.find().exec();
        if(!userplace) {
            ctx.status = 404;
            return;
        }
       ctx.body = userplace;
    } catch(e){
        ctx.throw(500, e);
    }
};

exports.listUserRoads = async ctx => {
    try{
        const userRoads = await UserRoad.find().exec();
        if(!userRoads) {
            ctx.status = 404;
            return;
        }
        ctx.body = userRoads;
    } catch(e){
        ctx.throw(500, e);
    }
};

exports.findUserRoadByUserName = async ctx => {
    const {username} = ctx.params;
  try{
    const userRoad = await UserRoad.findByUsername(username).exec();
    if(!userRoad){
        ctx.status = 404;
        return;
    }
    ctx.body = userRoad;
  }catch(e){
      ctx.throw(500,e);
  }
};

exports.findUserPlaceByUserName = async ctx => {
    console.log('hello!');
    const {username} = ctx.params;
    try{
        const userplace = await UserPlace.findByUsername(username).exec();
        if(!userplace){
            ctx.status = 404;
            return;
        }
        ctx.body = userplace;
    } catch(e){
        ctx.throw(500, e);
    }
};

exports.findUserPlace = async ctx => {
    const { id } = ctx.params;
    try{
        const userplace = await UserPlace.findById({_id: id}).exec();
        if(!userplace){
            ctx.status = 404;
            return;
        }
        ctx.body = userplace;

    } catch(e){
        ctx.throw(500, e);
    }
};


exports.makeUserRoad = async ctx => {
    const { username, name, description, tags, position, detailedPosition, publishingDate,
        primaryPositionType, secondaryPositionType, roadInfo, imageUrl, youtubeUrl } = ctx.request.body;
    let index = youtubeUrl.indexOf('v=');
    let youtubeVideoId = youtubeUrl.substring(index+2, youtubeUrl.length);
    const userRoad = new UserRoad({
        username, name, description, tags, position, detailedPosition, publishingDate,
        primaryPositionType, secondaryPositionType, roadInfo, imageUrl, block: 0,
        recommend : {good: 0, bad: 0, username: []}, youtubeVideoId
    });
    try{
        await userRoad.save();
        ctx.body = userRoad;
    } catch(e) {
        ctx.throw(500, e);
    }
};

exports.findUserPlaceByType = async ctx => {
    const { primary}  = ctx.params;
    try{
        const userplace = await UserPlace.findByType(primary).exec();
        if(!userplace){
            ctx.status = 404;
            return;
        }
        ctx.body = userplace;
    } catch(e){
        ctx.throw(500, e);
    }
};

exports.updateUserRoadComment = async ctx => {
    //console.dir('----------------------------');
    //console.dir(ctx.request.body);

    let arr = [];
    try{
        ctx.request.body.commentList.forEach(function(element){
            let { title, body, username } = element;
           const comment = new Comment({
               title: title,
               body: body,
               username: username,
           });
           comment.save();
           arr = arr.concat(comment);
        });
    }catch(e){
        ctx.throw(500, e);
    }

    const {id} = ctx.params;

    try{
        //console.dir(arr);
        const road = await UserRoad.findByIdAndUpdate(id, {commentList: arr}, {
            new: true,
        }).exec();
        if(!road){
            ctx.status = 404;
            return;
        }
        ctx.body = road;
    } catch(e){
        ctx.throw(500, e);
    }
};

export const checkOwnPost = (ctx, next) => {
    const { user, road } = ctx.state;
    if( road.user._id.toString() !== user._id) {
        ctx.status = 403;
        return;
    }
    return next();
};

export const updateUserPlaceComment = async ctx => {
    let arr = [];
    try{
        ctx.request.body.commentList.forEach(function(element){
            let { title, body, username } = element;
            const comment = new Comment({
                title: title,
                body: body,
                username: username,
            });
            comment.save();
            arr = arr.concat(comment);
        });
    }catch(e){
        ctx.throw(500, e);
    }

    const {id} = ctx.params;

    try{
        //console.dir(arr);
        const road = await UserPlace.findByIdAndUpdate(id, {commentList: arr}, {
            new: true,
        }).exec();
        if(!road){
            ctx.status = 404;
            return;
        }
        ctx.body = road;
    } catch(e){
        ctx.throw(500, e);
    }
};

export const deleteComment = async ctx => {
    const {userPlaceId, commentId} = ctx.request.body;
    //console.dir(commentId);
    try{
        const result = await UserPlace.findOne(userPlaceId).exec();
        const result2 = await UserPlace.findOneAndUpdate(userPlaceId,
            {commentList: result._doc.commentList.filter(comment => comment._id !== commentId)}, {new:true});
        console.dir(result2);
        if(!result || !result2 ){
            ctx.status = 404;
            return;
        }
        ctx.status = 200;
    }catch(e){
        ctx.throw(500, e);
    }
};

export const makeUserBuilding = async ctx => {
    const { username, name, description, tags, position, detailedPosition, publishingDate,
        primaryPositionType, secondaryPositionType, imageUrl, youtubeUrl, buildingPosition,
        roughMapUrl } = ctx.request.body;
    let index = youtubeUrl.indexOf('v=');
    let youtubeVideoId = youtubeUrl.substring(index+2, youtubeUrl.length);
    const userRoad = new UserBuilding({
        username, name, description, tags, position, detailedPosition, publishingDate,
        primaryPositionType, secondaryPositionType, imageUrl, block: 0, buildingPosition,
        recommend : {good: 0, bad: 0, username: []}, youtubeVideoId, roughMapUrl
    });
    try{
        await userRoad.save();
        ctx.body = userRoad;
    } catch(e) {
        ctx.throw(500, e);
    }
};

export const makeUserBundle = async ctx => {
    const { username, name, description, tags, position, detailedPosition, publishingDate,
        primaryPositionType, secondaryPositionType, roadList, placeList, buildingPosition, youtubeUrl } = ctx.request.body;
    let index = youtubeUrl.indexOf('v=');
    let youtubeVideoId = youtubeUrl.substring(index+2, youtubeUrl.length);
    const userBundle = new UserBundle({
        username, name, description, tags, position, detailedPosition, publishingDate,
        primaryPositionType, secondaryPositionType, roadList, placeList, buildingPosition, youtubeVideoId
    });
    try{
        await userBundle.save();
        ctx.body = userBundle;
    } catch(e) {
        ctx.throw(500, e);
    }
};

export const listUserBuilding = async ctx => {
    try{
        const userBuilding = await UserBuilding.find().exec();
        if(!userBuilding){
            ctx.status = 404;
            return;
        }
        ctx.body = userBuilding;
    }catch(e){
        ctx.throw(500, e);
    }
};

export const findUserRoad = async ctx => {
    const {id} = ctx.params;
  try{
      const result = await UserRoad.findOne({_id: id}).exec();
      if(!result){
          ctx.status = 404;
          return;
      }
      ctx.body = result;
  }catch(e){
      ctx.throw(500,e);
  }
};

export const findUserBuilding = async ctx => {
    const {id} = ctx.params;
    try{
        const result = await UserBuilding.findOne({_id: id}).exec();
        if(!result){
            ctx.status = 404;
            return;
        }
        ctx.body = result;
    }catch(e){
        ctx.throw(500, e);
    }
};

exports.listUserBundle = async ctx => {
    try{
        const userBundle = await UserBundle.find().exec();
        if(!userBundle) {
            ctx.status = 404;
            return;
        }
        ctx.body = userBundle;
    } catch(e){
        ctx.throw(500, e);
    }
};

export const updateUserPlaceRecommend = async  ctx => {
    const {id} = ctx.params;
    const { good, bad, username } = ctx.request.body;

    try{
        const result = await UserPlace.find({_id: id}).exec();
        if(!result){
            ctx.status = 404;
            return;
        }

        let inUserNameList = false;
        result[0]._doc.recommend.username.forEach(function(element){
           if(element === username)
               inUserNameList = true;
        });

        if(inUserNameList) {
            ctx.status = 400;
            return;
        }

        console.dir(result);
        const nextData = {...result[0]._doc, recommend : {
            good: good ? result[0]._doc.recommend.good + 1 : result[0]._doc.recommend.good,
            bad : bad ? result[0]._doc.recommend.bad + 1 : result[0]._doc.recommend.bad,
            username : result[0]._doc.recommend.username.concat(username)
            }};
        const result2 = await UserPlace.findOneAndUpdate({_id: id}, nextData, {new: true});
        ctx.body = result2;
    }catch(e){
        ctx.throw(500, e);
    }
};


