import Router from 'koa-router';
import * as mapCtrl from './map.ctrl';
import checkLoggedIn from "../../lib/checkLoggedIn";
import {check} from "../auth/auth.ctrl";

const map = new Router();

map.get('/username/:username', mapCtrl.findUserPlaceByUserName);

map.get('/userPlace/:id', mapCtrl.findUserPlace);

map.get('/userPlace', mapCtrl.listUserPlace);

map.get('/find/:primary', mapCtrl.findUserPlaceByType);

map.get('/userBundle', mapCtrl.listUserBundle);

map.get('/userRoad', mapCtrl.listUserRoads);

map.get('/userRoad/:id', mapCtrl.findUserRoad);

map.get('/userBuilding', mapCtrl.listUserBuilding);

map.get('/userBuilding/:id', mapCtrl.findUserBuilding);

map.get('/userRoad/username/:username', mapCtrl.findUserRoadByUserName);

map.get('/userBuilding/username/:username', mapCtrl.findUserBuildingByUserName);

map.get('/userBundle/username/:username', mapCtrl.findUserBundleByUserName);

map.get('/userPlace/Estimate/:id', mapCtrl.getUserPlaceEstimate);

map.get('/userRoad/Estimate/:id', mapCtrl.getUserRoadEstimate);

map.get('/userBuilding/Estimate/:id', mapCtrl.getUserBuildingEstimate);

map.get('/userBundle/Estimate/:id', mapCtrl.getUserBundleEstimate);

map.get('/userPlace/Recommend/:id', mapCtrl.getUserPlaceRecommend);
map.get('/userRoad/Recommend/:id', mapCtrl.getUserRoadRecommend);
map.get('/userBuilding/Recommend/:id', mapCtrl.getUserBuildingRecommend);
map.get('/userBundle/Recommend/:id', mapCtrl.getUserBundleRecommend);

map.post('/', mapCtrl.makeUserPlace);

map.post('/userRoad', mapCtrl.makeUserRoad);

map.post('/userBuilding', mapCtrl.makeUserBuilding);

map.post('/userBundle', checkLoggedIn, mapCtrl.makeUserBundle);

map.patch('/removeInfo', checkLoggedIn, mapCtrl.removeInfo);

map.patch('/userRoad/comment/:id', checkLoggedIn, mapCtrl.updateUserRoadComment);

map.patch('/userPlace/comment/:id', checkLoggedIn, mapCtrl.updateUserPlaceComment);

map.patch('/userBuilding/comment/:id', checkLoggedIn, mapCtrl.updateUserBuildingComment);

map.patch('/userPlace/recommend/:id', checkLoggedIn, mapCtrl.updateUserRecommend);

map.patch('/estimate/:id', checkLoggedIn, mapCtrl.updateUserEstimate);

map.patch('/userPlace/deleteComment', checkLoggedIn, mapCtrl.deleteComment);

map.patch('/warningComment/:id', checkLoggedIn, mapCtrl.updateUserCommentWarning);

export default map;
