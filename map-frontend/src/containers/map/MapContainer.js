import React, {useCallback, useEffect, useState} from 'react'
import {
    GoogleMap, LoadScript, DrawingManager, InfoWindow, DrawingManagerProps
    , Rectangle
} from '@react-google-maps/api'
import {Row, Col, Button, Container, Image, OverlayTrigger} from 'react-bootstrap';
import UserMarker from "../../components/map/UserMarker";
import MarkerInfo from "../../components/map/MarkerInfo";
import MapCircle, {MapCircleInfo} from "../../components/map/MapCircle";
import UserInfoBox from "../../components/map/UserInfoBox";
import UserPlaceContainer from "./UserPlaceContainer";
import {useSelector, useDispatch} from "react-redux";
import {changeField} from "../../modules/auth";
import RectangleContainer from "./RectangleContainer";
import PopOverButton from "../../components/common/PopOverButton";

const MapContainer = () => {
        const dispatch = useDispatch();
        const {loading, form} = useSelector(({map, loading}) => ({
            loading: loading,
            form: map.info,
        }));

        const [marker, setMarker] = useState(null);
        const [circle, setCircle] = useState(null);
        const [radius, setRadius] = useState(null);
        const [infoBox, setInfoBox] = useState(null);
        const [photo, setPhoto] = useState(null);
        const [rectangle, setRectangle] = useState(null);
        const [leftUpperPoint, setleftUpperPoint] = useState(null);
        const [rightDownPoint, setRightDownPoint] = useState(null);
        const [userPlaceList, setUserPlaceList] = useState(null);
        const initialPosition = {lat: 37.284315, lng: 127.044504};
        const [userPosition, setUserPosition] = useState({lat: null, lng: null});

        const onMapClick = useCallback( e => {
            if(!leftUpperPoint) {
                setleftUpperPoint({lat: e.latLng.lat(), lng: e.latLng.lng()});
                return;
            }
             if(leftUpperPoint && !rightDownPoint ){
                 setRightDownPoint({lat:e.latLng.lat(), lng:e.latLng.lng()});
                 return;
             }
             else {
                 setRightDownPoint(null);
                 setleftUpperPoint(null);
             }
        }, );


        const onMarkerButtonClick = () => {
            if (!marker) setMarker(true);
            else setMarker(false);
        };

        const onCircleButtonClick = () => {
            if (!circle) setCircle(true);
            else setCircle(false);
        };

        const onInfoButtonClick = () => {
            if (!infoBox) setInfoBox(true);
            else setInfoBox(false);
        };

        const onPhotoClick = () => {
            if (!photo) setPhoto(true);
            else setPhoto(false);
        };

        const onUserPlaceListClick = () => {
            if (!userPlaceList) setUserPlaceList(true);
            else setUserPlaceList(false);
        };

        const onRectangleClick = () => {
            if (!rectangle) {
                setRectangle(true);
            } else setRectangle(false);
        };


        const addMarker = (e) => {
            setUserPosition({lat: e.latLng.lat(), lng: e.latLng.lng()});
        };

        const onKeyPress = useCallback(
            e => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    setRadius(parseInt(e.target.value, 10));
                }
            }, [radius]
        );

        const onFormChange = e => {
            const {value, name} = e.target;
            dispatch(
                changeField({
                    form: 'userPlace',
                    key: name,
                    value,
                }),
            );
        };

        return (
            <Row>
                <Col>
                    <LoadScript
                        id="script-loader"
                        googleMapsApiKey="AIzaSyBoLaZLcIzTtGb0Ogg23GTiPkuXs0R-JwE">
                        <GoogleMap
                            mapContainerStyle={{
                                height: '400px',
                                width: '700px'
                            }}
                            zoom={15}
                            center={initialPosition}
                            onClick={onMapClick}>

                            {marker && <UserMarker position={userPosition}/>}
                            {circle && <MapCircle position={userPosition} radius={radius}/>}
                            {circle && <UserMarker position={userPosition}/>}
                            {infoBox && <UserMarker position={userPosition}/>}
                            {leftUpperPoint && rightDownPoint && <RectangleContainer
                                leftUpper={leftUpperPoint} rightDown={rightDownPoint}/>}
                        </GoogleMap>
                    </LoadScript>
                    <Button variant="outline-info" onClick={onMarkerButtonClick}>마커 추가</Button>
                    <Button variant="outline-info" onClick={onCircleButtonClick}>일정 범위 조회</Button>
                    <Button variant="outline-info" onClick={onInfoButtonClick}>유저 위치 추가</Button>
                    <Button variant="outline-info" onClick={onUserPlaceListClick}>유저 위치 리스트</Button>
                    <Button variant="outline-info" onClick={onPhotoClick}>사진 테스트</Button>
                    <PopOverButton contentMessage="사각형을 그리기 위해 맵에서 사각형의 좌측 상단에 해당하는 부분을 클릭 후
                맵에서 사각형의 우측 하단에 해당하는 부분을 클릭해주세요"
                                   titleMessage="사각형 그리는 방법" ButtonLabel="구역 추가하기"
                                   onClick={onRectangleClick}/>

                </Col>

                <Col>
                    {marker && <MarkerInfo position={userPosition}/>}
                    {circle && <MapCircleInfo position={userPosition} onKeyPress={onKeyPress}/>}
                    {infoBox && <UserInfoBox position={userPosition} form={form}/>}
                    {photo && (
                        <Container>
                            <Row>
                                <Col xs={6} md={4}>
                                    <Image src="https://mdbootstrap.com/img/Others/documentation/1.jpg" rounded/>
                                </Col>
                            </Row>
                        </Container>
                    )}
                    {userPlaceList && <UserPlaceContainer/>}
                </Col>
            </Row>
        );
    }
;

export default MapContainer;
