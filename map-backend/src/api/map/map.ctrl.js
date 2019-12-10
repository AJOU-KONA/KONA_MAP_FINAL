import UserPlace from "../../models/userPlace"
import Comment from "../../models/comment";
import UserRoad from "../../models/userRoad";
import sanitizeHtml from "sanitize-html";
import UserBundle from "../../models/userBundle";
import UserBuilding from "../../models/building";
import comment from "../comment";

exports.makeUserPlace = async ctx => {
    const {
        username, name, description, tags, position, detailedPosition, publishingDate,
        primaryPositionType, secondaryPositionType, radius, imageUrl, youtubeUrl, address
    } = ctx.request.body;

    let index = youtubeUrl ? youtubeUrl.indexOf('v=') : null;
    let youtubeVideoId = index ? youtubeUrl.substring(index + 2, youtubeUrl.length) : null;
    const userPlace = new UserPlace({
        username, name, description, tags, position, detailedPosition, publishingDate,
        primaryPositionType, secondaryPositionType, radius, imageUrl, block: 0,
        recommend: {good: 0, bad: 0, username: []}, youtubeVideoId, address,
        estimate : {good: 0, interest: 0, accuracy : 0, username: []}
    });
    try {
        await userPlace.save();
        ctx.body = userPlace;
    } catch (e) {
        ctx.throw(500, e);
    }
};

exports.listUserPlace = async ctx => {
    try {
        const userplace = await UserPlace.find().exec();
        if (!userplace) {
            ctx.status = 404;
            return;
        }
        ctx.body = userplace;
    } catch (e) {
        ctx.throw(500, e);
    }
};

exports.listUserRoads = async ctx => {
    try {
        const userRoads = await UserRoad.find().exec();
        if (!userRoads) {
            ctx.status = 404;
            return;
        }
        ctx.body = userRoads;
    } catch (e) {
        ctx.throw(500, e);
    }
};

export const findUserBuildingByUserName = async ctx => {
    const {username} = ctx.params;
    try{
        const userBuilding = await UserBuilding.find({username : username}).exec();
        if(!userBuilding) {
            ctx.status = 404;
            return;
        }
        ctx.body = userBuilding;
    }catch(e){
        ctx.throw(500, e);
    }
};

export const findUserBundleByUserName = async ctx => {
    const {username} = ctx.params;
    try{
        const userBundle = await UserBundle.find({username : username}).exec();
        if(!userBundle) {
            ctx.status = 404;
            return;
        }
        ctx.body = userBundle;
    }catch(e){
        ctx.throw(500, e);
    }
};

exports.findUserRoadByUserName = async ctx => {
    const {username} = ctx.params;
    try {
        const userRoad = await UserRoad.findByUsername(username).exec();
        if (!userRoad) {
            ctx.status = 404;
            return;
        }
        ctx.body = userRoad;
    } catch (e) {
        ctx.throw(500, e);
    }
};

exports.findUserPlaceByUserName = async ctx => {
    console.log('hello!');
    const {username} = ctx.params;
    try {
        const userplace = await UserPlace.findByUsername(username).exec();
        if (!userplace) {
            ctx.status = 404;
            return;
        }
        ctx.body = userplace;
    } catch (e) {
        ctx.throw(500, e);
    }
};

exports.findUserPlace = async ctx => {
    const {id} = ctx.params;
    try {
        const userplace = await UserPlace.findById({_id: id}).exec();
        if (!userplace) {
            ctx.status = 404;
            return;
        }
        ctx.body = userplace;

    } catch (e) {
        ctx.throw(500, e);
    }
};


exports.makeUserRoad = async ctx => {
    const {
        username, name, description, tags, position, detailedPosition, publishingDate,
        primaryPositionType, secondaryPositionType, roadInfo, imageUrl, youtubeUrl, address
    } = ctx.request.body;
    let index = youtubeUrl ? youtubeUrl.indexOf('v=') : null;
    let youtubeVideoId = index ? youtubeUrl.substring(index + 2, youtubeUrl.length) : null;
    const userRoad = new UserRoad({
        username, name, description, tags, position, detailedPosition, publishingDate,
        primaryPositionType, secondaryPositionType, roadInfo, imageUrl, block: 0,
        recommend: {good: 0, bad: 0, username: []}, youtubeVideoId, address,
        estimate : {good: 0, interest: 0, accuracy : 0, username: []}
    });
    try {
        await userRoad.save();
        ctx.body = userRoad;
    } catch (e) {
        ctx.throw(500, e);
    }
};

exports.findUserPlaceByType = async ctx => {
    const {primary} = ctx.params;
    try {
        const userplace = await UserPlace.findByType(primary).exec();
        if (!userplace) {
            ctx.status = 404;
            return;
        }
        ctx.body = userplace;
    } catch (e) {
        ctx.throw(500, e);
    }
};

exports.updateUserRoadComment = async ctx => {
    //console.dir('----------------------------');
    //console.dir(ctx.request.body);

    let arr = [];
    try {
        ctx.request.body.commentList.forEach(function (element) {
            let {title, body, username} = element;
            const comment = new Comment({
                title: title,
                body: body,
                username: username,
                status: {block: false, warningCount: 0}
            });
            comment.save();
            arr = arr.concat(comment);
        });
    } catch (e) {
        ctx.throw(500, e);
    }

    const {id} = ctx.params;

    try {
        //console.dir(arr);
        const road = await UserRoad.findByIdAndUpdate(id, {commentList: arr}, {
            new: true,
        }).exec();
        if (!road) {
            ctx.status = 404;
            return;
        }
        ctx.body = road;
    } catch (e) {
        ctx.throw(500, e);
    }
};

export const checkOwnPost = (ctx, next) => {
    const {user, road} = ctx.state;
    if (road.user._id.toString() !== user._id) {
        ctx.status = 403;
        return;
    }
    return next();
};

export const updateUserBuildingComment = async ctx => {
    console.dir('update building comment');
    let arr = [];
    try {
        ctx.request.body.commentList.forEach(function (element) {
            let {title, body, username} = element;
            const comment = new Comment({
                title: title,
                body: body,
                username: username,
                status: {block: false, warningCount: 0, username : []}
            });
            comment.save();
            arr = arr.concat(comment);
        });
    } catch (e) {
        ctx.throw(500, e);
    }

    const {id} = ctx.params;

    try {
        //console.dir(arr);
        const building = await UserBuilding.findByIdAndUpdate(id, {commentList: arr}, {
            new: true,
        }).exec();
        if (!building) {
            ctx.status = 404;
            return;
        }
        ctx.body = building;
    } catch (e) {
        ctx.throw(500, e);
    }
};

export const updateUserPlaceComment = async ctx => {
    let arr = [];
    try {
        ctx.request.body.commentList.forEach(function (element) {
            let {title, body, username} = element;
            const comment = new Comment({
                title: title,
                body: body,
                username: username,
                status: {block: false, warningCount: 0, username: []}
            });
            comment.save();
            arr = arr.concat(comment);
        });
    } catch (e) {
        ctx.throw(500, e);
    }

    const {id} = ctx.params;

    try {
        //console.dir(arr);
        const place = await UserPlace.findByIdAndUpdate(id, {commentList: arr}, {
            new: true,
        }).exec();
        if (!place) {
            ctx.status = 404;
            return;
        }
        ctx.body = place;
    } catch (e) {
        ctx.throw(500, e);
    }
};

export const deleteComment = async ctx => {
    const {userPlaceId, commentId} = ctx.request.body;
    //console.dir(commentId);
    try {
        const result = await UserPlace.findOne(userPlaceId).exec();
        const result2 = await UserPlace.findOneAndUpdate(userPlaceId,
            {commentList: result._doc.commentList.filter(comment => comment._id !== commentId)}, {new: true});
        console.dir(result2);
        if (!result || !result2) {
            ctx.status = 404;
            return;
        }
        ctx.status = 200;
    } catch (e) {
        ctx.throw(500, e);
    }
};

export const makeUserBuilding = async ctx => {
    let {
        tags, primaryPositionType, secondaryPositionType, username, buildingPosition,
        floor, floorArray, address
    } = ctx.request.body;


    floorArray.forEach(function(element){
        let index = element.youtubeUrl ? element.youtubeUrl.indexOf('v=') : null;
        element.youtubeVideoId = index ? element.youtubeUrl.substring(index + 2, element.youtubeUrl.length) : null;
    });

    const userBuilding = new UserBuilding({
        tags, primaryPositionType, secondaryPositionType, username, buildingPosition,
        floor, floorArray, address, block: 0, recommend: {good: 0, bad: 0, username: []},
        estimate : {good: 0, interest: 0, accuracy : 0, username: []}
    });

    try {
        await userBuilding.save();
        ctx.body = userBuilding;
    } catch (e) {
        ctx.throw(500, e);
    }
};

export const makeUserBundle = async ctx => {
    const {
        username, name, description, tags, position, detailedPosition, publishingDate,
        primaryPositionType, secondaryPositionType, roadList, placeList, buildingList, youtubeUrl,
        address
    } = ctx.request.body;
    let index = youtubeUrl ? youtubeUrl.indexOf('v=') : null;
    let youtubeVideoId = index ? youtubeUrl.substring(index + 2, youtubeUrl.length) : null;
    const userBundle = new UserBundle({
        username, name, description, tags, position, detailedPosition, publishingDate,
        primaryPositionType, secondaryPositionType, roadList, placeList, buildingList, youtubeVideoId,
        address, recommend: {good: 0, bad: 0, username: []},
        estimate : {good: 0, interest: 0, accuracy : 0, username: []}
    });
    try {
        await userBundle.save();
        ctx.body = userBundle;
    } catch (e) {
        ctx.throw(500, e);
    }
};

export const listUserBuilding = async ctx => {
    try {
        const userBuilding = await UserBuilding.find().exec();
        if (!userBuilding) {
            ctx.status = 404;
            return;
        }
        ctx.body = userBuilding;
    } catch (e) {
        ctx.throw(500, e);
    }
};

export const findUserRoad = async ctx => {
    const {id} = ctx.params;
    try {
        const result = await UserRoad.findOne({_id: id}).exec();
        if (!result) {
            ctx.status = 404;
            return;
        }
        ctx.body = result;
    } catch (e) {
        ctx.throw(500, e);
    }
};

export const findUserBuilding = async ctx => {
    const {id} = ctx.params;
    try {
        const result = await UserBuilding.findOne({_id: id}).exec();
        if (!result) {
            ctx.status = 404;
            return;
        }
        ctx.body = result;
    } catch (e) {
        ctx.throw(500, e);
    }
};

exports.listUserBundle = async ctx => {
    try {
        const userBundle = await UserBundle.find().exec();
        if (!userBundle) {
            ctx.status = 404;
            return;
        }
        ctx.body = userBundle;
    } catch (e) {
        ctx.throw(500, e);
    }
};

export const updateUserRecommend = async ctx => {
    const {id} = ctx.params;
    const {good, bad, username, type} = ctx.request.body;

    try {
        let result = null;
        switch (type) {
            case 'place': result = await UserPlace.findOne({_id: id}).exec(); break;
            case 'road' : result = await UserRoad.findOne({_id: id}).exec(); break;
            case 'building' : result = await UserBuilding.findOne({_id: id}).exec(); break;
            case 'bundle' : result = await UserBundle.findOne({_id: id}).exec(); break;
        }

        if (!result) {
            ctx.status = 404;
            return;
        }

        let inUserNameList = false;
        result._doc.recommend.username.forEach(function (element) {
            if (element === username)
                inUserNameList = true;
        });

        if (inUserNameList) {
            ctx.status = 400;
            return;
        }

        const nextData = {
            ...result._doc, recommend: {
                good: good ? result._doc.recommend.good + 1 : result._doc.recommend.good,
                bad: bad ? result._doc.recommend.bad + 1 : result._doc.recommend.bad,
                username: result._doc.recommend.username.concat(username)
            }
        };

        let result2 = null;
        switch(type){
            case 'place': result2 = await UserPlace.findOneAndUpdate({_id: id}, nextData, {new: true}); break;
            case 'road': result2 = await UserRoad.findOneAndUpdate({_id: id}, nextData, {new: true}); break;
            case 'building': result2 = await UserBuilding.findOneAndUpdate({_id: id}, nextData, {new: true}); break;
            case 'bundle': result2 = await UserBundle.findOneAndUpdate({_id: id}, nextData, {new: true}); break;
        }
        ctx.body = result2;
    } catch (e) {
        ctx.throw(500, e);
    }
};

export const updateUserEstimate = async ctx => {
    const {id} = ctx.params;
    const {good, interest, accuracy, username, type} = ctx.request.body;

    try {
        let result = null;
        switch(type){
            case 'place': result = await UserPlace.findOne({_id: id}).exec(); break;
            case 'road' : result = await UserRoad.findOne({_id: id}).exec(); break;
            case 'building' : result = await UserBuilding.findOne({_id: id}).exec(); break;
            case 'bundle': result = UserBundle.findOne({_id: id}).exec(); break;
        }

        if (!result) {
            ctx.status = 404;
            return;
        }

        let inUserNameList = false;
        result._doc.estimate.username.forEach(function (element) {
            if (element === username)
                inUserNameList = true;
        });

        if (inUserNameList) {
            ctx.status = 400;
            return;
        }

        let nextData = {
            ...result._doc, estimate: {
                good: good  + result._doc.estimate.good,
                interest: result._doc.estimate.interest + interest,
                accuracy: result._doc.estimate.accuracy + accuracy,
                username: result._doc.estimate.username.concat(username)
            }
        };
        let sum = nextData.estimate.good + nextData.estimate.accuracy + nextData.estimate.interest;
        nextData.estimate.total = sum;
        let result2 = null;
        switch (type) {
            case 'place' : result2 = await UserPlace.findOneAndUpdate({_id: id}, nextData, {new: true}); break;
            case 'road': result2 = await UserRoad.findOneAndUpdate({_id: id}, nextData, {new: true}); break;
            case 'building' : result2 = await UserBuilding.findOneAndUpdate({_id: id}, nextData, {new: true}); break;
            case 'bundle' : result2 = await UserBundle.findOneAndUpdate({_id: id}, nextData, {new: true}); break;
        }
        ctx.body = result2;
    } catch (e) {
        ctx.throw(500, e);
    }
};

export const getUserPlaceEstimate = async ctx => {
    const {id} = ctx.params;

    try{
        const result = await UserPlace.findOne({_id: id}).exec();
        if(!result){
            ctx.status = 404;
            return;
        }

        let formatted_total, formatted_accuracy, formatted_interest, formatted_good;
        formatted_accuracy = formatted_good = formatted_interest = formatted_total = 0;

        formatted_interest = result._doc.estimate.interest  / (result._doc.estimate.username.length ) ;
        formatted_accuracy = result._doc.estimate.accuracy  / (result._doc.estimate.username.length  ) ;
        formatted_good = result._doc.estimate.good  / (result._doc.estimate.username.length  ) ;
        formatted_total = result._doc.estimate.total  / (result._doc.estimate.username.length  * 3 ) ;
        let data = {formatted_accuracy, formatted_interest, formatted_total, formatted_good};
        ctx.body = data;
    } catch(e){
        ctx.throw(500, e);
    }
};

export const getUserRoadEstimate = async ctx => {
    const {id} = ctx.params;

    try{
        const result = await UserRoad.findOne({_id: id}).exec();
        if(!result){
            ctx.status = 404;
            return;
        }

        let formatted_total, formatted_accuracy, formatted_interest, formatted_good;
        formatted_accuracy = formatted_good = formatted_interest = formatted_total = 0;

        formatted_interest = result._doc.estimate.interest  / (result._doc.estimate.username.length ) ;
        formatted_accuracy = result._doc.estimate.accuracy  / (result._doc.estimate.username.length  ) ;
        formatted_good = result._doc.estimate.good  / (result._doc.estimate.username.length  ) ;
        formatted_total = result._doc.estimate.total  / (result._doc.estimate.username.length  * 3 ) ;
        let data = {formatted_accuracy, formatted_interest, formatted_total, formatted_good};
        ctx.body = data;
    } catch(e){
        ctx.throw(500, e);
    }
};

export const getUserBuildingEstimate = async ctx => {
    const {id} = ctx.params;

    try{
        const result = await UserBuilding.findOne({_id: id}).exec();
        if(!result){
            ctx.status = 404;
            return;
        }

        let formatted_total, formatted_accuracy, formatted_interest, formatted_good;
        formatted_accuracy = formatted_good = formatted_interest = formatted_total = 0;

        formatted_interest = result._doc.estimate.interest  / (result._doc.estimate.username.length ) ;
        formatted_accuracy = result._doc.estimate.accuracy  / (result._doc.estimate.username.length  ) ;
        formatted_good = result._doc.estimate.good  / (result._doc.estimate.username.length  ) ;
        formatted_total = result._doc.estimate.total  / (result._doc.estimate.username.length  * 3 ) ;
        let data = {formatted_accuracy, formatted_interest, formatted_total, formatted_good};
        ctx.body = data;
    } catch(e){
        ctx.throw(500, e);
    }
};

export const getUserBundleEstimate = async ctx => {
    const {id} = ctx.params;

    try{
        const result = await UserBundle.findOne({_id: id}).exec();
        if(!result){
            ctx.status = 404;
            return;
        }

        let formatted_total, formatted_accuracy, formatted_interest, formatted_good;
        formatted_accuracy = formatted_good = formatted_interest = formatted_total = 0;

        formatted_interest = result._doc.estimate.interest  / (result._doc.estimate.username.length ) ;
        formatted_accuracy = result._doc.estimate.accuracy  / (result._doc.estimate.username.length  ) ;
        formatted_good = result._doc.estimate.good  / (result._doc.estimate.username.length  ) ;
        formatted_total = result._doc.estimate.total  / (result._doc.estimate.username.length  * 3 ) ;
        let data = {formatted_accuracy, formatted_interest, formatted_total, formatted_good};
        ctx.body = data;
    } catch(e){
        ctx.throw(500, e);
    }
};



export const removeInfo = async ctx => {
    const {id, type } = ctx.request.body;
    console.dir(id);
    console.dir(type);

    let result = null;
    switch (type) {
        case 'place' : result = await UserPlace.findOneAndDelete({_id: id}).exec(); break;
        case 'building' : result = await UserBuilding.findOneAndDelete({_id: id}).exec(); break;
        case 'road' : result = await UserRoad.findOneAndDelete({_id: id}).exec(); break;
        case 'bundle' : result = await UserBundle.findOneAndDelete({_id: id}).exec(); break;
    }
    if(!result){
        ctx.status = 404;
        return;
    }
};

export const updateUserCommentWarning = async ctx => {
    const {id} = ctx.params;
    const {commentList, type} = ctx.request.body;
    //console.dir(commentList);
    try {
        let result;
        switch(type){
            case 'place' : result = await UserPlace.findOne({_id: id}).exec(); break;
            case 'road' : result = await UserRoad.findOne({_id: id}).exec(); break;
            case 'building' : result = await UserBuilding.findOne({_id: id}).exec(); break;
        }

        if (!result) {
            ctx.status = 404;
            return;
        }

        //이미 등록된 이름이 있는지 확인해보기
        let inUserNameList = false;
        result._doc.commentList.forEach(function (element) {
            const {commentId, username} = element;
            element.status.username.forEach(function (elementName) {
                if (elementName === username) inUserNameList = true;
            });
        });

        //이미 신고했으면 리턴
        if (inUserNameList) {
            ctx.status = 400;
            return;
        }

        const nextData = {...result._doc, commentList : commentList};
        let result2;
        switch(type){
            case 'place' : await UserPlace.findOneAndUpdate({_id: id}, nextData, {new:true}).exec(); break;
            case 'road' : await UserRoad.findOneAndUpdate({_id: id}, nextData, {new:true}).exec(); break;
            case 'building' : await UserBuilding.findOneAndUpdate({_id: id}, nextData, {new:true}).exec(); break;
        }
        ctx.body = result2;
    } catch (e) {
        ctx.throw(500, e);
    }
};
