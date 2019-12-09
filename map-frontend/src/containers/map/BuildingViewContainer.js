import React, {useCallback, useEffect, useReducer, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import client from "../../lib/api/client";
import {InfoWindow, Polyline, Rectangle} from "@react-google-maps/api";
import {Form, ListGroup, ListGroupItem, Nav, Row, Col} from "react-bootstrap";

import {polylineOptions, rectangleOptions} from "../../components/map/RoadColor";
import EstimateContainer from "./EstimateContainer";
import CommentContainer from "./CommentContainer";
import {fetchBuildingInfo, setInfoViewer, updateBookMark} from "../../modules/map";
import CardComponent from "../../components/map/CardComponent";
import CarouselContainer from "./CarouselContainer";

const initialState = {
    visibleOnMouseOver: false,
    visibleInfoWindow: false,
    visibleOnTabPosition: true,
    visibleOnTabEstimate: false,
    visibleOnTabComment: false,
    isInBookMark: false,
    commentList: [],
};

const BuildingViewList = ({buildingList}) => {
    return buildingList.map(building => (<BuildingViewListItem key={building._id} building={building}/>));
};

const buildingReducer = (state, action) => {
    switch (action.type) {
        case 'reset' : {
            return initialState
        }
        case 'toggleMouseOverWindow' : {
            return state.visibleOnMouseOver ? {...state, visibleOnMouseOver: false} : {
                ...state,
                visibleOnMouseOver: true
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
        case 'addBookMark' : {
            return {...state, isInBookMark: action.isInBookMark}
        }
        default: {
            throw new Error(`unexpected action.type: ${action.type}`)
        }
    }
};

const BuildingViewListItem = ({building}) => {
    const [localInfo, setLocalInfo] = useReducer(buildingReducer, initialState);
    const [loading, setLoading] = useState(false);

    const {username, buildingList, placeList, roadList, isAddBookMark, isMarkerClicked} = useSelector(({user, map}) => ({
        isMarkerClicked: map.isMarkerClicked,
        isAddBookMark: map.isAddBookMark,
        username: user.user.username,
        buildingList: map.bookMark.buildingList,
        placeList: map.bookMark.placeList,
        roadList: map.bookMark.roadList,
    }));
    const dispatch = useDispatch();

    const onBuildingClick = useCallback(() => {
        if(!isMarkerClicked){
            dispatch(setInfoViewer(true));
            dispatch(fetchBuildingInfo(building._id));
        }
        //setLocalInfo({type: 'toggleInfoWindow'})
    }, [localInfo, isMarkerClicked]);
    const onMouseOver = useCallback(() => setLocalInfo({type: 'toggleMouseOverWindow'}), [localInfo]);
    const onTabPositionClick = useCallback(() => setLocalInfo({type: 'toggleTabPosition'}), [localInfo]);
    const onTabEstimateClick = useCallback(() => setLocalInfo({type: 'toggleTabEstimate'}), [localInfo]);
    const onTabCommentClick = useCallback(() => setLocalInfo({type: 'toggleTabComment'}), [localInfo]);
    const updateComment = useCallback((value) => setLocalInfo({type: 'updateComment', comment: value}), [localInfo]);
    const updateLocalBookMark = useCallback((value) => {
        setLocalInfo({type: 'addBookMark', isInBookMark: value})
    }, [localInfo]);
    const onCloseClick = useCallback(() => {
        const uploadComment = async () => {
            setLoading(true);
            try {
                const response = await client.patch(`/api/map/userRoad/comment/${building._id}`, ({
                    commentList: localInfo.commentList,
                    username: username,
                }));
            } catch (e) {
                console.dir(e);
            }
            setLoading(false);
        };
        uploadComment();
    }, [localInfo]);

    const addInfoToBookMark = useCallback(() => {
        if (!localInfo.isInBookMark && isAddBookMark) {
            updateLocalBookMark(true);
            let updateBuilding = buildingList;
            updateBuilding = updateBuilding.concat(building);
            dispatch(updateBookMark({buildingList: buildingList, roadList: updateBuilding, placeList: placeList}));
        }
    }, [isAddBookMark]);

    useEffect(() => {
        console.dir(building);
    }, []);

    return (
        <>
            {localInfo.visibleOnMouseOver && !localInfo.visibleInfoWindow &&
            <InfoWindow position={{lat: building.buildingPosition[0].north, lng: building.buildingPosition[0].east}}
                options={{disableAutoPan : true}}>
                <CardComponent info={building}/>
            </InfoWindow>}
            {localInfo.visibleInfoWindow && <InfoWindow position={
                {lat: building.buildingPosition[0].north, lng: building.buildingPosition[0].east}}
                                                        onCloseClick={onCloseClick}
                                                        options={{maxWidth: "1200px", maxHeight: "600px"}}>
                <div style={{width: 1100, height: 600}}>
                    <Row>
                        <Col>
                            <div style={{width: 600, height: 600}}>
                                <CarouselContainer info={building}/>
                            </div>
                        </Col>
                        <Col>
                            <Nav fill justify variant="pills" defaultActiveKey="info-position">
                                <Nav.Item>
                                    <Nav.Link eventKey="info-position"
                                              onSelect={onTabPositionClick}
                                    >위치 정보</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="estimate-user"
                                              onSelect={onTabEstimateClick}
                                    >사용자 평가</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="comment-user"
                                              onSelect={onTabCommentClick}
                                    >댓글</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="bookMark"
                                              onSelect={addInfoToBookMark}
                                    >즐겨찾기추가
                                    </Nav.Link>
                                </Nav.Item>
                            </Nav>
                            <hr/>
                            {localInfo.visibleOnTabPosition && (
                                <>
                                    <Form style={{paddingLeft: 30, paddingRight: 30}}>
                                        <Form.Group as={Row}>
                                            <Form.Label column sm="4" style={{textAlign: "center"}}>
                                                이름
                                            </Form.Label>
                                            <ListGroup.Item>{building.name}</ListGroup.Item>
                                        </Form.Group>
                                        <Row>
                                            <Form.Label column sm="4" style={{textAlign: "center"}}>
                                                설명
                                            </Form.Label>
                                            <Col>
                                                <ListGroup.Item>{building.description}</ListGroup.Item>
                                            </Col>
                                        </Row>
                                        <Form.Group as={Row} style={{textAlign: "center"}}>
                                            <Form.Label column sm="4">
                                                위치 타입
                                            </Form.Label>
                                            <ListGroup.Item>{building.primaryPositionType}</ListGroup.Item>
                                            <ListGroup.Item>{building.secondaryPositionType}</ListGroup.Item>
                                        </Form.Group>
                                        <Form.Group as={Row} style={{textAlign: "center"}}>
                                            <Form.Label column sm="4">
                                                태그
                                            </Form.Label>
                                            {building.tags.map((tag, index) => (
                                                <ListGroupItem key={index}>#{tag}</ListGroupItem>))}
                                        </Form.Group>
                                    </Form>
                                    <p>등록일 : {building.publishingDate}</p>
                                </>
                            )}
                            {localInfo.visibleOnTabEstimate && <EstimateContainer/>}
                            {localInfo.visibleOnTabComment &&
                            <CommentContainer info={building} setUpdateCommentList={updateComment}/>}
                        </Col>
                    </Row>
                </div>
            </InfoWindow>}
            {building.buildingPosition.map((pos, index) => <Rectangle bounds={pos} key={index}onMouseOver={onMouseOver}
                                                                  onMouseOut={onMouseOver} onClick={onBuildingClick}/>)}
        </>
    )
};

const BuildingViewContainer = ({buildingList}) => {
    useEffect(() => {
        console.dir(buildingList);
    }, []);

    if (!buildingList) return null;

    return (
        <>
            <BuildingViewList buildingList={buildingList}/>
        </>
    );

};

export default BuildingViewContainer;
