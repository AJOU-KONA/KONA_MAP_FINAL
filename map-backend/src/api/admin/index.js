import Router from 'koa-router';
import * as adminCtrl from './admin.ctrl';
import checkLoggedIn from "../../lib/checkLoggedIn";
import * as mapCtrl from "../map/map.ctrl";
import map from "../map";

const admin = new Router();

admin.get('/userPlaceStatistics', adminCtrl.getUserPlaceStatistics);
admin.get('/userRoadStatistics', adminCtrl.getUserRoadStatistics);
admin.get('/userBuildingStatistics', adminCtrl.getUserBuildingStatistics);
admin.get('/userBundleStatistics', adminCtrl.getUserBundleStatistics);
admin.get('/userCommentStatistics', adminCtrl.getUserCommentStatistics);
admin.get('/userPlaceList', adminCtrl.getUserPlaceList);
admin.get('/userRoadList', adminCtrl.getUserRoadList);
admin.get('/userBuildingList', adminCtrl.getUserBuildingList);
admin.get('/userBundleList', adminCtrl.getUserBundleList);
admin.get('/userCommentList', adminCtrl.getUserCommentList);

admin.patch('/commentBlock/:id', checkLoggedIn, adminCtrl.fixComment);
admin.patch('/block/:id', checkLoggedIn, adminCtrl.fixBlock);
export default admin;
