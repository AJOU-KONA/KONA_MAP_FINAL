import Comment from "../../models/comment";
import UserPlace from "../../models/userPlace";
import Joi from "joi";
import comment from "./index";

function makeCommentList(array) {
    let newCommentList = [];
    for (const item of array) {
        const comment = makeComment(item);
        //console.dir(comment._doc);
        //console.log('\n\n\n\n');

        newCommentList = newCommentList.concat(comment._doc);

        //console.log('---------------------------------');
        //console.dir(comment);
        //console.log('---------------------------------');
    }
    console.log('Done!');
    //console.dir(newCommentList[1]);
    return newCommentList;
}

function makeComment(item){
    return new Comment({
        title: item.title,
        body: item.body,
        username: item.username
    });
};

export const register = async ctx => {
    console.dir('comment register');
    //console.dir(ctx.request.body);
    const schema = Joi.object().keys({
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(20)
            .required(),
        title: Joi.string(),
        body: Joi.string(),
    });

    ctx.request.body.forEach(function(element){
        const result = Joi.validate(ctx.request.body, schema);
        if (result.error) {
            ctx.status = 400;
            ctx.body = result.error;
            return;
        }
    });

    try {
        let {objectId} = ctx.params;

        const result = await UserPlace.findByObjectID(objectId);
        let commentList = result[0]._doc.commentList;

        if (!result) {
            ctx.status = 409;
            return;
        }

        let newCommentList = makeCommentList(ctx.request.body);
        const nextData = {...result, commentList: newCommentList};

        const result2 = UserPlace.findByIdAndUpdate(objectId, nextData, {
            new: true
        }).exec();
        if (!result2) {
            ctx.body = 404;
            return;
        }
        ctx.body = result2;
    } catch (e) {
        ctx.throw(500, e);
    }
};

export const findByUsername = async ctx => {
    const {username} = ctx.params;
    //console.dir(ctx.params);
    try {
        const comment = await Comment.findByUsername(username).exec();
        if (!comment) {
            ctx.status = 404;
            return;
        }
        ctx.body = comment;
    } catch (e) {
        ctx.throw(500, e);
    }
};

export const findByObjectID = async ctx => {
    const {objectId} = ctx.params;
    try {
        const userPlace = await Comment.findByObjectID(objectId).exec();
        if (!userPlace) {
            ctx.status = 404;
            return;
        }
        ctx.body = userPlace;
    } catch (e) {
        ctx.throw(500, e);
    }
};

export const fetchCommentList = async ctx => {
  try{
    const result = await Comment.find().exec();
    if(!result){
        ctx.status = 404;
        return;
    }
    ctx.body = result;
  } catch(e){
      ctx.throw(500, e);
  }
};

export const deleteComment = async ctx => {
    const {id} = ctx.params;
    try{
        const result2 = await Comment.find({_id: id}).exec();
        const result = await Comment.findOneAndDelete(id).exec();
        if(!result){
            ctx.status = 404;
            return;
        }
        ctx.body = result;
    }catch(e){
        ctx.throw(500, e);
    }
};
