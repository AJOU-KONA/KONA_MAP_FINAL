import UserRoad from "../../models/userRoad";
import UserPlace from "../../models/userPlace";
import UserBuilding from "../../models/userBuilding";
import UserBundle from "../../models/userBundle";
import Comment from "../../models/comment";

export const getUserPlaceList = async ctx => {
    try {
        const response = await UserPlace.find().exec();
        if (!response) {
            ctx.status = 404;
            return;
        }
        ctx.body = response;
    } catch (e) {
        ctx.throw(500, e);
    }
};

export const getUserRoadList = async ctx => {
    try {
        const response = await UserRoad.find().exec();
        if (!response) {
            ctx.status = 404;
            return;
        }
        ctx.body = response;
    } catch (e) {
        ctx.throw(500, e);
    }
};

export const getUserCommentList = async ctx => {
    try {
        const response = await Comment.find().exec();
        if (!response) {
            ctx.status = 404;
            return;
        }
        ctx.body = response;
    } catch (e) {
        ctx.throw(500, e);
    }
};


export const fixComment = async ctx => {
    const {id} = ctx.params;
    const {type, block} = ctx.request.body;
    try{
        let result = await Comment.findOneAndDelete({_id: id}).exec();
        if(!result){
            ctx.status = 404;
            return;
        }
        ctx.body = result;
    }catch(e){
        ctx.throw(500, e);
    }
};

export const fixBlock = async ctx => {
    const {id} = ctx.params;
    const {type, block} = ctx.request.body;

    try {
        let result = null;
        switch (type) {
            case 'place' :
                result = await UserPlace.findOne({_id: id}).exec();
                break;
            case 'road' :
                result = await UserRoad.findOne({_id: id}).exec();
                break;
            case 'building' :
                result = await UserBuilding.findOne({_id: id}).exec();
                break;
            case 'bundle' :
                result = await UserBundle.findOne({_id: id}).exec();
                break;
        }
        if (!result) {
            ctx.status = 404;
            return;
        }

        if (result._doc.block === undefined) {
            const newDoc = {...result._doc, block: 0};
            let result2 = null;
            switch (type) {
                case 'place' :
                    result2 = await UserPlace.findOneAndUpdate({_id: id}, newDoc, {new: true});
                    break;
                case 'road' :
                    result2 = await UserRoad.findOneAndUpdate({_id: id}, newDoc, {new: true});
                    break;
                case 'building' :
                    result2 = await UserBuilding.findOneAndUpdate({_id: id}, newDoc, {new: true});
                    break;
                case 'bundle' :
                    result2 = await UserBundle.findOneAndUpdate({_id: id}, newDoc, {new: true});
                    break;
            }
        }

        let result2 = null;
        const nextData = {...result._doc, block: block};
        switch (type) {
            case 'place' :
                result2 = await UserPlace.findOneAndUpdate({_id: id}, nextData, {new: true});
                break;
            case 'road' :
                result2 = await UserRoad.findOneAndUpdate({_id: id}, nextData, {new: true});
                break;
            case 'building' :
                result2 = await UserBuilding.findOneAndUpdate({_id: id}, nextData, {new: true});
                break;
            case 'bundle' :
                result2 = await UserBundle.findOneAndUpdate({_id: id}, nextData, {new: true});
                break;
        }


        ctx.body = result2;
    } catch (e) {
        ctx.throw(500, e);
    }
};

export const getUserBuildingList = async ctx => {
    try {
        const response = await UserBuilding.find().exec();
        if (!response) {
            ctx.status = 404;
            return;
        }
        ctx.body = response;
    } catch (e) {
        ctx.throw(500, e);
    }
};

export const getUserBundleList = async ctx => {
    try {
        const response = await UserBundle.find().exec();
        if (!response) {
            ctx.status = 404;
            return;
        }
        ctx.body = response;
    } catch (e) {
        ctx.throw(500, e);
    }
};


export const getUserRoadStatistics = async ctx => {
    let statistics = {totalNumber: 0};
    try {
        const data = await UserRoad.find().exec();
        //총 갯수
        statistics.totalNumber = data.length;

        ctx.body = statistics;
    } catch (e) {
        ctx.throw(500, e);
    }
};

export const getUserPlaceStatistics = async ctx => {
    let statistics = {totalNumber: 0};
    try {
        const data = await UserPlace.find().exec();
        //총 갯수
        statistics.totalNumber = data.length;

        //분류별 인원
        ctx.body = statistics;
    } catch (e) {
        ctx.throw(500, e);
    }
};

export const getUserBuildingStatistics = async ctx => {
    let statistics = {totalNumber: 0};
    try {
        const data = await UserBuilding.find().exec();
        //총 갯수
        statistics.totalNumber = data.length;

        //분류별 인원
        ctx.body = statistics;
    } catch (e) {
        ctx.throw(500, e);
    }
};

export const getUserBundleStatistics = async ctx => {
    let statistics = {totalNumber: 0};
    try {
        const data = await UserBundle.find().exec();
        //총 갯수
        statistics.totalNumber = data.length;

        //분류별 인원
        ctx.body = statistics;
    } catch (e) {
        ctx.throw(500, e);
    }
};

export const getUserCommentStatistics = async ctx => {
    let statistics = {totalNumber: 0};
    try {
        const data = await Comment.find().exec();
        //총 갯수
        statistics.totalNumber = data.length;

        ctx.body = statistics;
    } catch (e) {
        ctx.throw(500, e);
    }
}


