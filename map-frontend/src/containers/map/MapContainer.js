import React, {useCallback, useEffect, useReducer, useState} from 'react'
import {
    GoogleMap,
    DrawingManager,
    LoadScriptNext, InfoWindow, Rectangle, Data,
} from '@react-google-maps/api'
import {Row, Col, Button} from 'react-bootstrap';
import UserMarker from "../../components/map/UserMarker";
import MapCircle, {MapCircleInfo} from "../../components/map/MapCircle";
import {useSelector, useDispatch} from "react-redux";
import UserInfoOnMapContainer from "./UserInfoOnMapContainer";
import styled from "styled-components";
import RoadControlContainer from "./RoadControlContainer";
import RoadModal from "../../components/map/RoadModal";
import RoadViewContainer from "./RoadViewContainer";
import RoadDropDownButton from "../../components/map/RoadDropDownButton";
import {polylineOptions, rectangleOptions, circleOptions} from "../../components/map/RoadColor";
import RoadRemarkContainer from "../../components/map/RoadRemarkContainer";
import BookMarkConainer from "./BookMarkContainer";
import InfoViewerContainer from "./InfoViewerContainer";
import BuildingRemarkContainer from "./BuildingRemarkContainer";
import BuildingModal from "../../components/map/BuildingModal";
import sig2 from '../../GeoJSON/sig2.json';
import {fetchBuildingInfo, removeFetchedData, setZoom} from "../../modules/map";

const StyledMapContainerWrapper = styled.div`
    position: fixed;
`;

const mapContainerStyle = {
    withoutInfoWindow: {
        width: '1550px',
        height: '700px'
    },
    withInfoWindow: {
        width: '600px',
        height: '700px'

    }
};

const getPolyLineOption = (type) => {
    switch (type) {
        case 'mainRoad' :
            return polylineOptions.mainRoad;
        case 'smallRoad' :
            return polylineOptions.smallRoad;
        case 'travelRoad' :
            return polylineOptions.travelRoad;
        case 'foodRoad' :
            return polylineOptions.foodRoad;
        case 'sightSeeingRoad' :
            return polylineOptions.sightSeeingRoad;
        default :
            return polylineOptions.mainRoad;
    }
};

const initialPosition = {lat: 37.284315, lng: 127.044504};

const initialState = {
    radius: 0,
    fetchedRoadList: null,
    userPosition: {lat: null, lng: null},
    map: null,
    currentUserLocation: null,
    drawingMode: null,
    circle: null,
    insertInfoBox: null,
    userLocOnMap: null,
    center: initialPosition,
    zoom: 15,
    isAddRoadInfo: false,
    isAddBuildingInfo: false,
    rectangleList: [],
    dataObject: null
};

const infoReducer = (state, action) => {
    switch (action.type) {
        case 'reset': {
            return initialState
        }
        case 'updateName': {
            return {...state, name: action.name}
        }
        case 'updateRadius' : {
            return {...state, radius: action.radius}
        }
        case "updateFetchedRoadList": {
            return {...state, fetchedRoadList: action.fetchedRoadList}
        }
        case 'updateUserPosition' : {
            return {...state, userPosition: action.userPosition}
        }
        case 'updateMap' : {
            return {...state, map: action.map}
        }
        case 'updateCurrentUserLocation' : {
            return {...state, currentUserLocation: action.currentUserLocation}
        }
        case 'updateDrawingMode': {
            return {...state, drawingMode: action.drawingMode}
        }
        case 'updateCircle' : {
            return {...state, circle: action.circle}
        }
        case 'updateInsertInfoBox': {
            return {...state, insertInfoBox: action.insertInfoBox}
        }
        case 'updateUserLocOnMap': {
            return {...state, userLocOnMap: action.userLocOnMap}
        }
        case 'updateCenter' : {
            return {...state, center: action.center}
        }
        case 'updateZoom' : {
            return {...state, zoom: action.zoom}
        }
        case 'updateIsAddRoadInfo' : {
            return {...state, isAddRoadInfo: action.isAddRoadInfo}
        }
        case 'updateIsAddBuildingInfo': {
            return {...state, isAddBuildingInfo: !state.isAddBuildingInfo}
        }
        case 'updateRectangle' : {
            return {...state, rectangleList: state.rectangleList.concat(action.rectangle)}
        }
        case 'resetRectangle' : {
            return {...state, rectangleList: []}
        }
        case 'getDataObject' : {
            return {...state, dataObject: action.dataObject}
        }
        default: {
            throw new Error(`unexpected action.type: ${action.type}`)
        }
    }
};

const MapContainer = () => {
        const dispatch = useDispatch();
        const {
            username, searchQueryOnMap, currentUserLocation, isAddInfo, isAddRoad, roadType,
            searchQueryType, isClearMap, isAddBookMark, isMarkerClicked, isAddBuilding, reduxZoom
        } = useSelector(({map, user}) => ({
            searchQueryOnMap: map.searchQuery.searchQueryOnMap,
            searchQueryType: map.searchQuery.searchQueryType,
            currentUserLocation: map.currentUserLocaction,
            isAddInfo: map.isAddInfo,
            isAddRoad: map.isAddRoad,
            username: user.user.username,
            roadType: map.roadType,
            isClearMap: map.isClearMap,
            isAddBookMark: map.isAddBookMark,
            isMarkerClicked: map.isMarkerClicked,
            isAddBuilding: map.isAddBuilding,
            reduxZoom: map.zoom
        }));

        const [localInfo, setLocalInfo] = useReducer(infoReducer, initialState);
        const [uploadRoadList, setUploadRoadList] = useState([]);
        const [roadList, setRoadList] = useState([]);
        const [polyLineObject, setPolyLineObject] = useState(null);
        const [visibleRoad, setVisibleRoad] = useState(null);

        const updateRadius = useCallback((value) => {
            setLocalInfo({type: 'updateRadius', radius: value})
        }, []);

        const updateFetchedRoadList = useCallback((value) => {
            setLocalInfo({type: 'updateFetchedRoadList', fetchedRoadList: value});
        }, []);

        const updateUserPosition = useCallback((e) => {
            setLocalInfo({type: 'updateUserPosition', userPosition: {lat: e.latLng.lat(), lng: e.latLng.lng()}});
        }, []);

        const getMapObject = useCallback((e) => {
            setLocalInfo({type: 'updateMap', map: e});
        }, []);

        const updateDrawingMode = useCallback((value) => {
            setLocalInfo({type: 'updateDrawingMode', drawingMode: value});
        }, []);

        const updateCircle = useCallback((value) => {
            setLocalInfo({type: 'updateCircle', circle: value});
        }, []);

        const updateInsertInfoBox = useCallback((value) => {
            setLocalInfo({type: 'updateInsertInfoBox', insertInfoBox: value})
        }, []);

        const updateUserLocOnMap = useCallback((value) => {
            setLocalInfo({type: 'updateUserLocOnMap', userLocOnMap: value})
        }, []);

        const updateCenter = useCallback((value) => {
            setLocalInfo({type: 'updateCenter', center: value});
        }, []);

        const updateZoom = useCallback((value) => {
            setLocalInfo({type: 'updateZoom', zoom: value});
        }, []);

        const updateIsAddRoadInfo = useCallback((value) => {
            setLocalInfo({type: 'updateIsAddRoadInfo', isAddRoadInfo: value});
        }, []);

        const updateRectangle = useCallback((e) => {
            setLocalInfo({type: 'updateRectangle', rectangle: e});
        }, []);

        const updateIsAddBuildingInfo = useCallback(() => {
            setLocalInfo({type: 'updateIsAddBuildingInfo'});
        }, [isAddBuilding]);
        const getDataObject = useCallback((e) => {
            setLocalInfo({type: 'getDataObject', dataObject: e})
        }, [localInfo.map]);

        useEffect(() => {
            const loadGeoJsonFunction = async () => {
                try {
                    //console.dir(localInfo.dataObject);
                    await localInfo.dataObject.loadGeoJson(sig2);
                    await localInfo.dataObject.setStyle({
                        marker: '',
                    });
                    //await localInfo.dataObject.setMap(localInfo.map);
                } catch (e) {
                    console.dir(e)
                }
            };
            if (localInfo.dataObject) {

                loadGeoJsonFunction();
                console.dir('geojson 로딩 완료');
            }
        }, [localInfo.dataObject]);

        const onMapClick = useCallback(e => {
            console.dir('클릭');
            if (localInfo.circle || localInfo.insertInfoBox) {
                addMarker(e);
            }
        }, [localInfo.circle, localInfo.insertInfoBox]);

        const addMarker = useCallback((e) => {
            updateUserPosition(e);
        }, [localInfo.userPosition, updateUserPosition]);

        const onKeyPressForRadius = useCallback(
            e => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    updateRadius(parseInt(e.target.value, 10));
                }
            }, [updateRadius]);

        const onRightClick = useCallback((e) => {
            updateDrawingMode(null);
        }, [updateDrawingMode]);

        useEffect(() => {
            updateDrawingMode('');
        }, [localInfo.drawingMode, updateDrawingMode]);

        useEffect(() => {
            if (!localInfo.userLocOnMap) updateUserLocOnMap(currentUserLocation);
        }, [currentUserLocation, updateUserLocOnMap, localInfo.userLocOnMap]);

        useEffect(() => {
            if (isAddInfo) updateInsertInfoBox(true);
            else updateInsertInfoBox(false);
        }, [isAddInfo, updateInsertInfoBox]);

        useEffect(() => {
            console.dir(localInfo.zoom);
        }, [localInfo.zoom]);

        useEffect(() => {
            console.dir(localInfo.rectangleList);
        }, [localInfo.rectangleList]);

        const getPolyLineObject = useCallback(e => {
            setPolyLineObject(e);
        }, [polyLineObject]);

        const RemovePolyLine = useCallback(e => {
            const removePolyLine = () => {
                try {
                    if (roadList) {
                        roadList.map((road, index) => (road.setMap(null)));
                    }
                } catch (e) {
                    console.dir(e);
                }
            };
            removePolyLine();
        }, [polyLineObject, roadList]);

        const getCenter = useCallback(e => {
            const fetchCenter = async () => {
                try {
                    const response = await localInfo.map.getCenter();
                    updateCenter(response);
                } catch (e) {
                    console.dir(e);
                }
            };
            fetchCenter();
        }, [localInfo.map, updateCenter]);

        const onZoomChanged = useCallback(e => {
            const fetchZoom = async () => {
                try {
                    const response = await localInfo.map.getZoom();
                    updateZoom(response);
                } catch (e) {
                    console.dir(e);
                }
            };
            fetchZoom();
        }, [localInfo.map, updateZoom]);

        const onPolylineComplete = useCallback(
            e => {
                //console.dir(e.getPath());
                let arr = [];
                e.getPath().g.forEach(function (element) {
                    arr = arr.concat({lat: element.lat(), lng: element.lng()});
                });
                setRoadList(roadList.concat(arr));
            }, [setRoadList, roadList]);

        const onRectangleComplete = useCallback(e => {
            const rectangle = {
                east: e.bounds.ka.h, west: e.bounds.ka.g,
                north: e.bounds.pa.h, south: e.bounds.pa.g
            };
            updateRectangle(rectangle);
        }, [updateRectangle]);

        const addRoadInfo = useCallback(
            () => {
                if (!localInfo.isAddRoadInfo) updateIsAddRoadInfo(true);
                else updateIsAddRoadInfo(false);
            }, [updateIsAddRoadInfo, localInfo.isAddRoadInfo]);

        useEffect(() => {
            console.dir(localInfo.dataObject);
        }, [localInfo.dataObject]);

        return (
            <Row>
                {localInfo.circle && <MapCircleInfo setRadius={updateRadius} onKeyPress={onKeyPressForRadius}
                                                    radius={localInfo.radius}/>}
                {isAddRoad && <RoadDropDownButton addRoadInfo={addRoadInfo}/>}
                {searchQueryOnMap && searchQueryType === 'road' && <RoadRemarkContainer/>}

                {isAddBookMark && <BookMarkConainer/>}
                {isMarkerClicked && <InfoViewerContainer/>}
                {isAddBuilding && <BuildingRemarkContainer addBuildingInfo={updateIsAddBuildingInfo}/>}

                <StyledMapContainerWrapper>
                    <Col>
                        <LoadScriptNext
                            id="script-loader"
                            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY}
                            libraries={[`drawing`]}>

                            <GoogleMap
                                mapContainerStyle={isMarkerClicked ?
                                    mapContainerStyle.withInfoWindow : mapContainerStyle.withoutInfoWindow}
                                zoom={localInfo.zoom}
                                center={localInfo.center}
                                onClick={onMapClick}
                                onLoad={getMapObject}
                                onZoomChanged={onZoomChanged}
                                onDragEnd={getCenter}
                                onRightClick={onRightClick}
                                options={{
                                    zoomControl: true,
                                    panControl: true,
                                    fullscreenControl: true,
                                    gestureHandling: "cooperative",
                                }}
                            >
                                {!localInfo.drawingMode && <DrawingManager drawingMode={localInfo.drawingMode}
                                                                           options={{
                                                                               polylineOptions: getPolyLineOption(roadType),
                                                                               circleOptions: circleOptions.circleOption,
                                                                               rectangleOptions: rectangleOptions.rectangleOption
                                                                           }}
                                                                           onRectangleComplete={onRectangleComplete}
                                                                           onPolylineComplete={onPolylineComplete}
                                                                           onLoad={getPolyLineObject}
                                />}
                                {localInfo.circle &&
                                <MapCircle position={localInfo.userPosition} radius={localInfo.radius}/>}
                                {localInfo.insertInfoBox &&
                                <UserMarker position={localInfo.userPosition} circle={localInfo.circle}
                                            setCircle={updateCircle} onKeyPress={onKeyPressForRadius}
                                            setRadius={updateRadius} radius={localInfo.radius}
                                />}

                                {searchQueryOnMap && !isClearMap && <UserInfoOnMapContainer zoom={localInfo.zoom}/>}
                                {localInfo.userLocOnMap &&
                                <UserMarker position={localInfo.userLocOnMap} circle={-1} animation={true}/>}
                                {localInfo.fetchedRoadList && <RoadViewContainer/>}
                                {visibleRoad &&
                                <RoadControlContainer uploadRoadList={uploadRoadList} roadList={roadList}
                                                      map={localInfo.map}/>}
                            </GoogleMap>
                        </LoadScriptNext>
                        {localInfo.isAddRoadInfo && <RoadModal roadPath={roadList}/>}
                        {localInfo.isAddBuildingInfo && <BuildingModal buildingList={localInfo.rectangleList}
                                                                       closeModal={updateIsAddBuildingInfo}/>}
                    </Col>
                </StyledMapContainerWrapper>
            </Row>
        );
    }
;

export default MapContainer;
