import {createAction, handleActions} from 'redux-actions';
import {takeLatest} from 'redux-saga/effects';
import createRequestSaga, {createRequestActionTypes} from "../lib/createRequestSaga";
import * as mapAPI from '../lib/api/map';

const [LIST, LIST_SUCCESS, LIST_FAILURE] = createRequestActionTypes('map/LIST');
const [POST_USER_PLACE, POST_USER_PLACE_SUCCESS, POST_USER_PLACE_FAILURE] = createRequestActionTypes('map/POST_USER_PLACE');
const SET_SEARCH_QUERY = 'map/SET_SEARCH_QUERY';
const SET_CURRENT_USER_LOCATION = 'map/SET_CURRENT_USER_LOCATION';
const SET_COMMENT_LIST  = 'map/SET_COMMENT_LIST';
const SET_COMMENT = 'map/SET_COMMENT';
const SET_ADD_INFO_ON_MAP = 'map/SET_ADD_INFO_ON_MAP';
const SET_ADD_ROAD_ON_MAP = 'map/SET_ADD_ROAD_ON_MAP';
const SET_ROAD_TYPE_ON_MAP = 'map/SET_ROAD_TYPE_ON_MAP';
const CLEAR_MAP = 'map/CLEAR_MAP';
const UPDATE_BOOK_MARK = 'map/UPDATE_BOOK_MARK';
const START_ADD_BOOK_MARK = 'map/START_ADD_BOOK_MARK';
const SET_INFO_VIEWER = 'map/SET_INFO_VIEWER';
const [FETCH_PLACE_INFO, FETCH_PLACE_INFO_SUCCESS, FETCH_PLACE_INFO_FAILURE] = createRequestActionTypes('map/FETCH_PLACE_INFO');

// 액션에 할당된 파라미터의 값이 어떤것인지 알 수 없기 때문에 파라미터로 전달받은 값을 action의 payload로 설정함
export const list = createAction(LIST, info => info);
export const post = createAction(POST_USER_PLACE, ({name, description, tags, position, detailedPosition}) => ({
    name, description, tags, position, detailedPosition,
}));
export const fetchPlaceInfo = createAction(FETCH_PLACE_INFO, data=> data);
export const setSearchQuery = createAction(SET_SEARCH_QUERY,
    ({searchQuery, searchQueryType, searchQueryOnMap, searchQueryOption}) => ({
    searchQuery, searchQueryType, searchQueryOnMap, searchQueryOption
}));
export const clearMap = createAction(CLEAR_MAP, isclearMap => isclearMap);
export const updateBookMark = createAction(UPDATE_BOOK_MARK, ({buildingList, roadList, placeList}) =>
    ({buildingList, roadList, placeList}));
export const addBookMark = createAction(START_ADD_BOOK_MARK, isStart => isStart);

export const setInfoViewer = createAction(SET_INFO_VIEWER, value=>value);
export const setCurrentUserLocation = createAction(SET_CURRENT_USER_LOCATION, location => location);
export const setCommentList = createAction(SET_COMMENT_LIST, (commentList) => (commentList) );
export const setComment = createAction(SET_COMMENT, comment => comment);
export const setAddInfoOnMap = createAction(SET_ADD_INFO_ON_MAP, isAddInfo => isAddInfo);
export const setAddRoadOnMap = createAction(SET_ADD_ROAD_ON_MAP, isAddRoad => isAddRoad);
export const setRoadTypeOnMap = createAction(SET_ROAD_TYPE_ON_MAP, roadType => roadType);

//{name, description, tags, position, detailedPosition, publishingDate}

const listUserPlaceSaga = createRequestSaga(LIST, mapAPI.list);
const postUserPlaceSaga = createRequestSaga(POST_USER_PLACE, mapAPI.post);
const fetchPlaceInfoSaga = createRequestSaga(FETCH_PLACE_INFO, mapAPI.fetchPlaceInfo);

export function* mapSaga() {
    yield takeLatest(LIST, listUserPlaceSaga);
    yield takeLatest(POST_USER_PLACE, postUserPlaceSaga);
    yield takeLatest(FETCH_PLACE_INFO, fetchPlaceInfoSaga);
}

const initialState = {
    searchQuery: {
        searchQueryType: 'place',
        searchQuery: '',
        searchQueryOnMap: false,
        searchQueryOption: '',
    },
    isClearMap: false,
    currentUserLocaction: {
        lat: '',
        lng: '',
    },
    commentList : null,
    comment: null,
    isAddInfo: false,
    isAddRoad: false,
    isMarkerClicked : false,
    roadType: 'mainRoad',
    info: {
        name: '',
        description: '',
        tags: [],
        position: {lat: '', lng: ''},
        detailedPosition: '',
        publishingDate: '',
        id: '',
        primaryPositionType: '',
        secondaryPositionType: '',
        radius: 0,
    },
    placeInfo: null,
    roadInfo: null,
    isAddBookMark: false,
    bookMark : {
        buildingList: [],
        roadList : [],
        placeList : [],
    },
    error: null,
};

const map = handleActions(
    {
        //첫번째 파라미터로 액션에 따라 실행할 함수를 가지고 있는 객체
        //두번째 파라미터로 상태의 기본값(initialState)
        [LIST_SUCCESS]: (state, {payload: info}) => ({
            ...state,
            info: info
        }),
        [LIST_FAILURE]: (state, {payload: error}) => ({
            ...state,
            error,
        }),
        [POST_USER_PLACE_SUCCESS]: (state, {payload: info}) => ({
            ...state,
            info: info
        }),
        [POST_USER_PLACE_FAILURE]: (state, {payload: error}) => ({
            ...state,
            error,
        }),
        [SET_SEARCH_QUERY]: (state, {payload: query}) => ({
            ...state,
            searchQuery: query,
        }),
        [SET_CURRENT_USER_LOCATION]: (state, {payload: location}) => ({
            ...state,
            currentUserLocaction: location,
        }),
        [SET_COMMENT_LIST] : (state, {payload: commentList}) => ({
           ...state,
           commentList: commentList,
        }),
        [SET_COMMENT] : (state, {payload: comment}) => ({
            ...state,
            comment: comment,
        }),
        [SET_ADD_INFO_ON_MAP] : (state, {payload: isAddInfo}) => ({
            ...state,
            isAddInfo: isAddInfo
        }),
        [SET_ADD_ROAD_ON_MAP] : (state, {payload: isAddRoad}) => ({
            ...state,
            isAddRoad: isAddRoad
        }),
        [SET_ROAD_TYPE_ON_MAP] : (state, {payload: roadType}) => ({
            ...state,
            roadType: roadType
        }),
        [CLEAR_MAP] : (state, {payload: isClearMap}) => ({
           ...state,
            isClearMap: isClearMap
        }),
        [UPDATE_BOOK_MARK] : (state, {payload: addedInfo}) => ({
            ...state,
            bookMark: {
            buildingList: state.bookMark.buildingList === addedInfo.buildingList ?
                state.bookMark.buildingList : state.bookMark.buildingList.concat(addedInfo.buildingList),
            placeList: state.bookMark.placeList === addedInfo.placeList ?
                 state.bookMark.placeList : state.bookMark.placeList.concat(addedInfo.placeList),
            roadList: state.bookMark.roadList === addedInfo.roadList ?
                state.bookMark.roadList : state.bookMark.roadList.concat(addedInfo.roadList)}
        }),
        [START_ADD_BOOK_MARK] : (state, {payload : isStart}) => ({
            ...state,
            isAddBookMark : isStart,
        }),
        [SET_INFO_VIEWER] : (state, {payload: value}) => ({
            ...state,
            isMarkerClicked: value,
        }),
        [FETCH_PLACE_INFO_SUCCESS] : (state, {payload: data}) => ({
            ...state,
            placeInfo: data
        }),
        [FETCH_PLACE_INFO_FAILURE] : (state, {payload: error}) => ({
            ...state,
            error: error
        }),
    },
    initialState,
);

export default map;
