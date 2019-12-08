import React, {useCallback, useEffect, useReducer, useState} from "react";
import {Marker, InfoWindow, Circle} from "@react-google-maps/api";
import {Nav, Form, Row, Col, ListGroup, ListGroupItem} from 'react-bootstrap';
import CommentContainer from "../../containers/map/CommentContainer";
import stadiumIcon from '../../lib/styles/MarkerImage/icons/stadium.svg';
import schoolIcon from '../../lib/styles/MarkerImage/icons/college-graduation.png';
import hostpitalIcon from '../../lib/styles/MarkerImage/icons/hospital.svg';
import amuseIcon from '../../lib/styles/MarkerImage/icons/amused.png';
import foodIcon from '../../lib/styles/MarkerImage/icons/restaurant.png';
import carIcon from '../../lib/styles/MarkerImage/icons/car.png';
import bedIcon from '../../lib/styles/MarkerImage/icons/bed.png';
import convenientIcon from '../../lib/styles/MarkerImage/icons/convenience-store.png';
import salonIcon from '../../lib/styles/MarkerImage/icons/salon.png';
import {useDispatch, useSelector} from "react-redux";
import {updateBookMark, setInfoViewer, fetchPlaceInfo, setCommentList} from "../../modules/map";
import client from "../../lib/api/client";
import ClusterMarkerContainer from "../../containers/map/ClusterMarkerContainer";
import RoadViewContainer from "../../containers/map/RoadViewContainer";
import CardComponent from "./CardComponent";
import styled from "styled-components";
import BuildingViewContainer from "../../containers/map/BuildingViewContainer";

const findIcon = primaryType => {
    switch (primaryType) {
        case 'education':
            return schoolIcon;
        case 'excercise':
            return stadiumIcon;
        case 'hospital' :
            return hostpitalIcon;
        case 'entertainment' :
            return amuseIcon;
        case "food":
            return foodIcon;
        case "transport" :
            return carIcon;
        case "restPlace":
            return bedIcon;
        case "convenience" :
            return convenientIcon;
        case "hairshop" :
            return salonIcon;
        default :
            return null;
    }
};

const adjustMouseOverPosition = (position, zoom) => {
    let customPosition = {lat: null, lng: position.lng};
    switch (zoom) {
        case 15 :
            customPosition.lat = position.lat + 0.0015;
            break;
        case 16 :
            customPosition.lat = position.lat + 0.001;
            break;
        case 17 :
            customPosition.lat = position.lat + 0.0005;
            break;
        case 18 :
            customPosition.lat = position.lat + 0.0003;
            break;
        case 19 :
            customPosition.lat = position.lat + 0.0001;
            break;
        case 20 :
            customPosition.lat = position.lat + 0.0001;
            break;
        case 21 :
        case 22:
        case 23:
        case 24:
        case 25:
            customPosition.lat = position.lat;
            break;
        default :
            customPosition.lat = position.lat;
            break;
    }
    return customPosition;
};

const VerticalLine = styled.div`
  border-left: 1px dotted blue;
  height: 450px;
  position: absolute;
  left: 50%;
  margin-left: -3px;
  top: 0;
`;

const InfoWindowList = ({placeInfo, roadInfo, buildingInfo, zoom}) => {
    const {searchQuery, searchQueryType, searchQueryOption} = useSelector(({map}) => ({
        searchQueryType: map.searchQuery.searchQueryType,
        searchQuery: map.searchQuery.searchQuery,
        searchQueryOption: map.searchQuery.searchQueryOption
    }));
    const [filteredData, setFilteredData] = useState(null);
    const [filteredBundleRoad, setFilteredBundleRoad] = useState(null);
    const [filteredBundlePlace, setFilteredBundlePlace] = useState(null);

    useEffect(() => {
        if (searchQueryType === 'place') {
            switch (searchQueryOption) {
                case "name":
                    setFilteredData(placeInfo.filter(inf => (inf.name.indexOf(searchQuery)) !== -1 ? inf : null));
                    break;
                case "tag":
                    setFilteredData(placeInfo.filter(inf => (inf.tags.indexOf(searchQuery)) !== -1 ? inf : null));
                    break;
                case "description":
                    setFilteredData(placeInfo.filter(inf => (inf.description.indexOf(searchQuery)) !== -1 ? inf : null));
                    break;
                case "position":
                    setFilteredData(placeInfo.filter(inf => (inf.detailedPosition.indexOf(searchQuery)) !== -1 ? inf : null));
                    break;
                default:
                    setFilteredData(placeInfo.filter(inf => (inf.name.indexOf(searchQuery)) !== -1 ? inf : null));
            }
        } else if (searchQueryType === 'road') { // 경로 검색
            switch (searchQueryOption) {
                case "name":
                    setFilteredData(roadInfo.filter(inf => (inf.name.indexOf(searchQuery)) !== -1 ? inf : null));
                    break;
                case "tag":
                    setFilteredData(roadInfo.filter(inf => (inf.tags.indexOf(searchQuery)) !== -1 ? inf : null));
                    break;
                case "description":
                    setFilteredData(roadInfo.filter(inf => (inf.description.indexOf(searchQuery)) !== -1 ? inf : null));
                    break;
                case "position":
                    setFilteredData(roadInfo.filter(inf => (inf.detailedPosition.indexOf(searchQuery)) !== -1 ? inf : null));
                    break;
                default:
                    setFilteredData(roadInfo.filter(inf => (inf.name.indexOf(searchQuery)) !== -1 ? inf : null));
            }
        } else if ( searchQueryType === 'building' ){ // 건물 검색
            switch (searchQueryOption) {
                case "name":
                    setFilteredData(buildingInfo.filter(inf => (inf.name.indexOf(searchQuery)) !== -1 ? inf : null));
                    break;
                case "tag":
                    setFilteredData(buildingInfo.filter(inf => (inf.tags.indexOf(searchQuery)) !== -1 ? inf : null));
                    break;
                case "description":
                    setFilteredData(buildingInfo.filter(inf => (inf.description.indexOf(searchQuery)) !== -1 ? inf : null));
                    break;
                case "position":
                    setFilteredData(buildingInfo.filter(inf => (inf.detailedPosition.indexOf(searchQuery)) !== -1 ? inf : null));
                    break;
                default:
                    setFilteredData(buildingInfo.filter(inf => (inf.name.indexOf(searchQuery)) !== -1 ? inf : null));
            }
        } else {
            switch (searchQueryOption) {
                case "name":
                    setFilteredBundlePlace(placeInfo.filter(inf => (inf.name.indexOf(searchQuery)) !== -1 ? inf : null));
                    setFilteredBundleRoad(roadInfo.filter(inf => (inf.name.indexOf(searchQuery)) !== -1 ? inf : null));
                    break;
                case "tag":
                    setFilteredBundlePlace(placeInfo.filter(inf => (inf.tags.indexOf(searchQuery)) !== -1 ? inf : null));
                    setFilteredBundleRoad(roadInfo.filter(inf => (inf.tags.indexOf(searchQuery)) !== -1 ? inf : null));
                    break;
                case "description":
                    setFilteredBundlePlace(placeInfo.filter(inf => (inf.description.indexOf(searchQuery)) !== -1 ? inf : null));
                    setFilteredBundleRoad(roadInfo.filter(inf => (inf.description.indexOf(searchQuery)) !== -1 ? inf : null));
                    break;
                case "position":
                    setFilteredBundlePlace(placeInfo.filter(inf => (inf.detailedPosition.indexOf(searchQuery)) !== -1 ? inf : null));
                    setFilteredBundleRoad(roadInfo.filter(inf => (inf.detailedPosition.indexOf(searchQuery)) !== -1 ? inf : null));
                    break;
                default:
                    setFilteredBundlePlace(placeInfo.filter(inf => (inf.name.indexOf(searchQuery)) !== -1 ? inf : null));
                    setFilteredBundleRoad(roadInfo.filter(inf => (inf.name.indexOf(searchQuery)) !== -1 ? inf : null));
            }
        }
    }, [searchQuery, searchQueryType, searchQueryOption]);

    useEffect(() => {
        console.dir(filteredData);
    }, [filteredData]);

    if (searchQueryType !== 'bundle' && !filteredData) return null;
    if (searchQueryType === 'bundle' && (!filteredBundlePlace || !filteredBundleRoad)) return null;

    return (
        <>
            {searchQueryType === 'place' && <ClusterMarkerContainer zoom={zoom} info={filteredData}/>}
            {searchQueryType === 'place' && filteredData.map((inf) => (
                <InfoWindowItem zoom={zoom} key={inf._id} info={inf}/>))}}
            {searchQueryType === 'road' && <RoadViewContainer roadList={filteredData}/>}
            {searchQueryType === 'building' && <BuildingViewContainer buildingList={filteredData}/>}
            {searchQueryType === 'bundle' && <RoadViewContainer roadList={filteredBundleRoad}/>}
            {searchQueryType === 'bundle' && filteredBundlePlace.map((inf) => (
                <InfoWindowItem zoom={zoom} key={inf._id} info={inf}/>))}
        </>
    );
};

const InfoWindowReducer = (state, action) => {
    switch (action.type) {
        case 'reset' : {
            return initialState
        }
        case 'toggleMouseOverWindow' : {
            return state.visibleMarkerMouseOver ? {...state, visibleMarkerMouseOver: false} : {
                ...state,
                visibleMarkerMouseOver: true
            };
        }
        case 'toggleInfoWindow' : {
            return state.visibleInfoWindow ? {...state, visibleInfoWindow: false} : {...state, visibleInfoWindow: true};
        }
        case 'toggleTabPosition' : {
            return {...state, visibleOnTabPosition: true, visibleOnTabComment: false, visibleOnTabEstimate: false}
        }
        case 'toggleTabEstimate' : {
            return {...state, visibleOnTabEstimate: true, visibleOnTabPosition: false, visibleOnTabComment: false}
        }
        case 'toggleTabComment' : {
            return {...state, visibleOnTabComment: true, visibleOnTabEstimate: false, visibleOnTabPosition: false}
        }
        case 'updateComment' : {
            return {...state, commentList: action.comment};
        }
        case 'toggleCloseBox' : {
            return {...state, isCloseBox: action.isCloseBox};
        }
        case 'addBookMark' : {
            return {...state, isInBookMark: action.isInBookMark}
        }
        case 'setInfoWindowObject' : {
            return {...state, infoWindowObject: action.infoWindowObject}
        }
        default: {
            throw new Error(`unexpected action.type: ${action.type}`)
        }
    }
};

const initialState = {
    visibleMarkerMouseOver: false,
    visibleOnTabPosition: true,
    visibleOnTabEstimate: false,
    toggleTabComment: false,
    commentList: [],
    visibleInfoWindow: false,
    isCloseBox: true,
    isInBookMark: false,
    infoWindowObject: null,
};

const InfoWindowItem = ({info, zoom}) => {
    const [localInfo, setLocalInfo] = useReducer(InfoWindowReducer, initialState);
    const {username, isAddBookMark, buildingList, roadList, placeList, isMarkerClicked,
    storeCommentList, searchQueryType } = useSelector(({user, map}) => ({
        username: user.user.username,
        isAddBookMark: map.isAddBookMark,
        buildingList: map.bookMark.buildingList,
        roadList: map.bookMark.roadList,
        placeList: map.bookMark.placeList,
        isMarkerClicked: map.isMarkerClicked,
        storeCommentList: map.commentList,
        searchQueryType: map.searchQuery.searchQueryType,
    }));
    const dispatch = useDispatch();

    useEffect(() => {
        console.dir(isMarkerClicked);
    }, [isMarkerClicked]);

    const toggleMarKerMouseOver = useCallback(() => {
        setLocalInfo({type: 'toggleMouseOverWindow'})
    }, [localInfo]);
    const toggleInfoWindow = useCallback(() => {
        console.dir(isMarkerClicked);
        if(!isMarkerClicked) {
            dispatch(fetchPlaceInfo(info._id));
            dispatch(setInfoViewer(true));
        }
        else dispatch(setInfoViewer(false));
        //setLocalInfo({type: 'toggleInfoWindow'})
    }, [localInfo, isMarkerClicked]);

    const updateLocalBookMark = useCallback((value) => {
        setLocalInfo({type: 'addBookMark', isInBookMark: value})
    }, [localInfo]);

    const addInfoToBookMark = useCallback(() => {
        if (!localInfo.isInBookMark && isAddBookMark) {
            updateLocalBookMark(true);
            let updatePlace = placeList;
            updatePlace = updatePlace.concat(info);
            dispatch(updateBookMark({buildingList: buildingList, roadList: roadList, placeList: updatePlace}));
        }
    }, [isAddBookMark]);


    {/*
    useEffect(() => {
        console.dir(storeCommentList);
        const uploadComment = async () => {
            try {
                if(searchQueryType === 'place' )
                    await client.patch(`/api/map/userPlace/comment/${localInfo.filteredData._id}`, {
                        commentList : localInfo.commentList
                    });
                if(searchQueryType === 'road' )
                    await client.patch(`/api/map/userRoad/comment/${localInfo.filteredData._id}`, {
                        commentList : localInfo.commentList
                    });
                if(searchQueryType === 'building' )
                    await client.patch(`/api/map/userBuilding/comment/${localInfo.filteredData._id}`, {
                        commentList : localInfo.commentList
                    });
            } catch (e) {
                console.dir(e);
            }
        };

        if(!isMarkerClicked && storeCommentList !== []){
            //uploadComment();
            dispatch(setCommentList([]));
        }
    }, [isMarkerClicked, storeCommentList, searchQueryType]);
    */}

    if (!info) return null;


    return (
        <>
            {localInfo.visibleMarkerMouseOver && !localInfo.visibleInfoWindow && <InfoWindow
                position={adjustMouseOverPosition(info.position, zoom)}
                options={{disableAutoPan: true}}>
                <CardComponent info={info}/>
            </InfoWindow>}

            <Marker position={info.position} onClick={toggleInfoWindow}
                    icon={zoom > 13 ? findIcon(info.primaryPositionType) : null}
                    visible={zoom <= 13 ? false : true}
                    onMouseOver={toggleMarKerMouseOver}
                    onMouseOut={toggleMarKerMouseOver}
            />

            {info.radius !== undefined && localInfo.visibleInfoWindow &&
            <Circle center={info.position} radius={info.radius}/>}

        </>
    );
};

export default InfoWindowList;
