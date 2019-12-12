import client from "./client";

export const fetchUserPlaceStatistics = () => client.get('/api/admin/userPlaceStatistics');
export const fetchUserRoadStatistics = () => client.get('/api/admin/userRoadStatistics');
export const fetchUserBuildingStatistics = () => client.get('/api/admin/userBuildingStatistics');
export const fetchUserBundleStatistics = () => client.get('/api/admin/userBundleStatistics');
export const fetchUserPlaceList = () => client.get('/api/admin/userPlaceList');
export const fetchUserRoadList = () => client.get('/api/admin/userRoadList');
export const fetchUserBuildingList = () => client.get('/api/admin/userBuildingList');
export const fetchUserBundleList = () => client.get('/api/admin/userBundleList');
export const fetchUserCommentStatistics = () => client.get('/api/admin/userCommentStatistics');
export const fetchUserCommentList = () => client.get('/api/admin/userCommentList');

