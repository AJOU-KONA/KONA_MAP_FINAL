import React, {useCallback, useEffect, useReducer, useState} from 'react'
import {
    GoogleMap,
    DrawingManager,
    LoadScriptNext, InfoWindow,
} from '@react-google-maps/api'
import {Row, Col, Button} from 'react-bootstrap';
import UserMarker from "../../components/map/UserMarker";
import MarkerInfo from "../../components/map/MarkerInfo";
import MapCircle, {MapCircleInfo} from "../../components/map/MapCircle";
import UserPlaceContainer from "./UserPlaceContainer";
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

const StyledMapContainerWrapper = styled.div`
    position: fixed;
`;

const mapContainerStyle={
    withoutInfoWindow : {
        width: '1350px',
        height: '550px'
    },
    withInfoWindow : {
        width: '600px',
        height: '550px'

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

const initialState = {
    radius: 0,
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
        default: {
            throw new Error(`unexpected action.type: ${action.type}`)
        }
    }
};

const MapContainer = () => {
        const dispatch = useDispatch();
        const {
            username, searchQueryOnMap, currentUserLocation, isAddInfo, isAddRoad, roadType,
            searchQueryType, isClearMap, isAddBookMark, isMarkerClicked, isAddBuilding
        } = useSelector(({map, user}) => ({
            searchQueryOnMap: map.searchQuery.searchQueryOnMap,
            searchQueryType: map.searchQuery.searchQueryType,
            currentUserLocation: map.currentUserLocaction,
            isAddInfo: map.isAddInfo,
            isAddRoad: map.isAddRoad,
            username: user.user.username,
            roadType: map.roadType,
            isClearMap: map.isClearMap,
            isAddBookMark : map.isAddBookMark,
            isMarkerClicked: map.isMarkerClicked,
            isAddBuilding: map.isAddBuilding
        }));

        const initialPosition = {lat: 37.284315, lng: 127.044504};
        const [localInfo, setLocalInfo] = useReducer(infoReducer, initialState);
        const [fetchedRoadList, setFetchedRoadList] = useState(null);
        const [uploadRoadList, setUploadRoadList] = useState([]);
        const [roadList, setRoadList] = useState([]);
        const [userLocOnMap, setUserLocOnMap] = useState(null);
        const [map, setMap] = useState(null);
        const [polyLineObject, setPolyLineObject] = useState(null);
        const [zoom, setZoom] = useState(15);
        const [drawingMode, setDrawingMode] = useState(null);
        const [marker, setMarker] = useState(null);
        const [center, setCenter] = useState(initialPosition);
        const [circle, setCircle] = useState(null);
        const [radius, setRadius] = useState(null);
        const [insertInfoBox, setInsertInfoBox] = useState(null);
        const [leftUpperPoint, setLeftUpperPoint] = useState(null);
        const [rightDownPoint, setRightDownPoint] = useState(null);
        const [userPlaceList, setUserPlaceList] = useState(null);
        const [userPosition, setUserPosition] = useState({lat: null, lng: null});
        const [visibleRoad, setVisibleRoad] = useState(null);
        const [isAddRoadInfo, setIsAddRoadInfo] = useState(null);

        const updateRadius = useCallback((value) => {
            setLocalInfo({type: 'updateRadius', radius: value})
        }, [localInfo.radius]);

        const onMapClick = useCallback(e => {
            console.dir('클릭');
            if (circle || insertInfoBox) {
                addMarker(e);
            }
        }, [circle, insertInfoBox]);

        const onUserPlaceListClick = useCallback(() => {
            if (!userPlaceList) setUserPlaceList(true);
            else setUserPlaceList(false);
        }, [userPlaceList]);

        const addMarker = useCallback((e) => {
            setUserPosition({lat: e.latLng.lat(), lng: e.latLng.lng()});
        }, [userPosition]);

        const onKeyPressForRadius = useCallback(
            e => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    updateRadius(parseInt(e.target.value, 10));
                }
            }, [localInfo.radius]);

        const onRightClick = useCallback((e) => {
                setDrawingMode(null);
            },[drawingMode]);

        useEffect(() => {
            setDrawingMode('');
        }, [drawingMode]);

        useEffect(() => {
            if (!userLocOnMap) setUserLocOnMap(currentUserLocation);
            else setUserLocOnMap(false);
        }, [currentUserLocation]);

        useEffect(() => {
            if (isAddInfo) setInsertInfoBox(true);
            else setInsertInfoBox(false);
        }, [isAddInfo]);

        useEffect(() => {
            console.dir(zoom);
        }, [zoom]);

        useEffect(() => {
            if (!currentUserLocation) setUserLocOnMap(true);
        }, [currentUserLocation]);

        const onCompleteRectangleInDrawingManager = useCallback(
            e => {
                console.dir(e);
            }, [drawingMode]);

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

        const getMapObject = useCallback(e => {
            setMap(e);
            //console.dir(e.getZoom());
        }, [map]);

        const getCenter = useCallback( e=> {
            const fetchCenter = async () => {
                try{
                    const response = await map.getCenter();
                    setCenter(response);
                }catch(e){
                    console.dir(e);
                }
            };
            fetchCenter();
        }, [map]);

        const onZoomChanged = useCallback(e => {
            const fetchZoom = async () => {
                try {
                    const response = await map.getZoom();
                    setZoom(response);
                } catch (e) {
                    console.dir(e);
                }
            };
            fetchZoom();
        }, [map]);

        useEffect(() => {
            setDrawingMode('');
            console.dir(drawingMode);
        }, [drawingMode]);

        const onPolylineComplete = useCallback(
            e => {
                console.dir(e.getPath());
                let arr = [];
                e.getPath().g.forEach(function (element) {
                    arr = arr.concat({lat: element.lat(), lng: element.lng()});
                });
                setRoadList(roadList.concat(arr));
            }, [drawingMode]);

        useEffect(() =>{
            console.dir(center);
        }, [center]);

        const onVisibleToggle = useCallback(
            () => {
                if (!visibleRoad) setVisibleRoad(true);
                else setVisibleRoad(false);
            }, [visibleRoad]);

        const addRoadInfo = useCallback(
            () => {
                if (!isAddRoadInfo) setIsAddRoadInfo(true);
                else setIsAddRoadInfo(false);
            }, [roadList]);

        const fetchRoad = useCallback(
            () => {
                if (!fetchedRoadList) setFetchedRoadList(true);
                else setFetchedRoadList(false);
            }, [fetchedRoadList]);

        return (
            <Row>
                {circle && <MapCircleInfo setRadius={updateRadius} onKeyPress={onKeyPressForRadius}
                                          radius={localInfo.radius}/>}
                {isAddRoad && <RoadDropDownButton addRoadInfo={addRoadInfo}/>}
                {searchQueryOnMap && searchQueryType === 'road' && <RoadRemarkContainer/>}

                {isAddBookMark && <BookMarkConainer/>}
                {isMarkerClicked && <InfoViewerContainer/>}
                {isAddBuilding && <BuildingRemarkContainer/>}


                <StyledMapContainerWrapper>
                    <Col>
                        <LoadScriptNext
                            id="script-loader"
                            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY}
                            libraries={[`drawing`]}>

                            <GoogleMap
                                mapContainerStyle={isMarkerClicked ?
                                    mapContainerStyle.withInfoWindow: mapContainerStyle.withoutInfoWindow}
                                zoom={zoom}
                                center={center}
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
                                { !drawingMode && <DrawingManager onRectangleComplete={onCompleteRectangleInDrawingManager}
                                                                 drawingMode={drawingMode}
                                                                 options={{
                                                                     polylineOptions: getPolyLineOption(roadType),
                                                                     circleOptions: circleOptions.circleOption,
                                                                     rectangleOptions: rectangleOptions.rectangleOption
                                                                 }}
                                                                 onPolylineComplete={onPolylineComplete}
                                                                 onLoad={getPolyLineObject}
                                />}
                                {circle && <MapCircle position={userPosition} radius={localInfo.radius}/>}
                                {insertInfoBox && <UserMarker position={userPosition} circle={circle}
                                                              setCircle={setCircle} onKeyPress={onKeyPressForRadius}
                                                              setRadius={updateRadius} radius={localInfo.radius}
                                />}

                                {searchQueryOnMap && !isClearMap && <UserInfoOnMapContainer zoom={zoom}/>}
                                {userLocOnMap && <UserMarker position={userLocOnMap} circle={-1} animation={true}/>}
                                {fetchedRoadList && <RoadViewContainer/>}
                                {visibleRoad &&
                                <RoadControlContainer uploadRoadList={uploadRoadList} roadList={roadList} map={map}/>}
                            </GoogleMap>
                        </LoadScriptNext>
                        {isAddRoadInfo && <RoadModal roadPath={roadList}/>}
                    </Col>

                    <Col>
                        {marker && <MarkerInfo position={userPosition}/>}
                        {userPlaceList && <UserPlaceContainer/>}

                    </Col>
                </StyledMapContainerWrapper>
            </Row>
        );
    }
;

export default MapContainer;
