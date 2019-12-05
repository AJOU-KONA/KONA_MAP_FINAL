import Router from 'koa-router';
import * as mapCtrl from './map.ctrl';
import checkLoggedIn from "../../lib/checkLoggedIn";

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

map.post('/', mapCtrl.makeUserPlace);

map.post('/userRoad', mapCtrl.makeUserRoad);

map.post('/userBuilding', mapCtrl.makeUserBuilding);

map.post('/userBundle', checkLoggedIn, mapCtrl.makeUserBundle);

map.patch('/userRoad/comment/:id', checkLoggedIn, mapCtrl.updateUserRoadComment);

map.patch('/userPlace/comment/:id', checkLoggedIn, mapCtrl.updateUserPlaceComment);

map.patch('/userPlace/recommend/:id', checkLoggedIn, mapCtrl.updateUserPlaceRecommend);

map.patch('/userPlace/deleteComment', checkLoggedIn, mapCtrl.deleteComment);

export default map;
