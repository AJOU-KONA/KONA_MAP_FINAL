import React, {useCallback, useEffect, useReducer, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import client from "../../lib/api/client";
import {InfoWindow, Polyline} from "@react-google-maps/api";
import {Form, ListGroup, ListGroupItem, Nav, Row, Col} from "react-bootstrap";

import {polylineOptions} from "../../components/map/RoadColor";
import EstimateContainer from "./EstimateContainer";
import CommentContainer from "./CommentContainer";
import {fetchRoadInfo, setInfoViewer, updateBookMark} from "../../modules/map";
import CardComponent from "../../components/map/CardComponent";
import CarouselContainer from "./CarouselContainer";

const getPrimaryPosition = (road) => {
    switch (road.primaryPositionType) {
        case "mainRoad" :
            return '큰 도로';
        case "smallRoad" :
            return '작은 도로';
        case "travelRoad":
            return '여행로';
        case "foodRoad":
            return '음식 추천로';
        case "sightSeeingRoad":
            return '관광로';
    }
    ;
};

const selectPolyLineOption = (road) => {
    let option = null;
    switch (road.primaryPositionType) {
        case "mainRoad" :
            option = polylineOptions.mainRoad;
            break;
        case "smallRoad" :
            option = polylineOptions.smallRoad;
            break;
        case "travelRoad":
            option = polylineOptions.travelRoad;
            break;
        case "foodRoad":
            option = polylineOptions.foodRoad;
            break;
        case "sightSeeingRoad":
            option = polylineOptions.sightSeeingRoad;
            break;
        default :
            option = polylineOptions.mainRoad;
    }
    ;
    return option;
};

const getRoadInfoWindowPosition = (road) => {
    return {
        lat: road.roadInfo[parseInt(road.roadInfo.length / 2)].lat,
        lng: road.roadInfo[parseInt(road.roadInfo.length / 2)].lng
    };
};

const initialState = {
    visibleOnMouseOver: false,
    visibleInfoWindow: false,
    visibleOnTabPosition: true,
    visibleOnTabEstimate: false,
    visibleOnTabComment: false,
    isInBookMark: false,
    commentList: [],
};

const RoadViewList = ({roadList}) => {
    return roadList.map(road => (<RoadViewListItem key={road._id} road={road}/>));
};

const roadReducer = (state, action) => {
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

const RoadViewListItem = ({road}) => {
    const [localInfo, setLocalInfo] = useReducer(roadReducer, initialState);
    const [loading, setLoading] = useState(false);

    const {username, buildingList, placeList, roadList, isAddBookMark,
    isMarkerClicked} = useSelector(({user, map}) => ({
        isAddBookMark: map.isAddBookMark,
        username: user.user.username,
        buildingList: map.bookMark.buildingList,
        placeList: map.bookMark.placeList,
        roadList: map.bookMark.roadList,
        isMarkerClicked: map.isMarkerClicked
    }));
    const dispatch = useDispatch();

    const onRoadClick = useCallback(() => {
        if(!isMarkerClicked) {
            dispatch(setInfoViewer(true));
            dispatch(fetchRoadInfo(road._id));
        }
        //setLocalInfo({type: 'toggleInfoWindow'});
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
                const response = await client.patch(`/api/map/userRoad/comment/${road._id}`, ({
                    commentList: localInfo.commentList,
                    username: username,
                }));
            } catch (e) {
                console.dir(e);
            }
            setLoading(false);
        };
        //uploadComment();
    }, [localInfo]);



    const addInfoToBookMark = useCallback(() => {
        if (!localInfo.isInBookMark && isAddBookMark) {
            updateLocalBookMark(true);
            let updateRoad = roadList;
            updateRoad = updateRoad.concat(road);
            dispatch(updateBookMark({buildingList: buildingList, roadList: updateRoad, placeList: placeList}));
        }
    }, [isAddBookMark]);


    return (
        <>
            {localInfo.visibleOnMouseOver && !localInfo.visibleInfoWindow &&
            <InfoWindow position={getRoadInfoWindowPosition(road)} options={{disableAutoPan : true}}>
                <CardComponent info={road}/>
            </InfoWindow>}
            {/*
            {localInfo.visibleInfoWindow && <InfoWindow position={getRoadInfoWindowPosition(road)}
                                                        onCloseClick={onCloseClick}
                                                        options={{maxWidth: "1200px", maxHeight: "600px"}}>
                <div style={{width: 1100, height: 600}}>
                    <Row>
                        <Col>
                            <div style={{width: 600, height: 600}}>
                                <CarouselContainer info={road}/>
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
                                            <ListGroup.Item>{road.name}</ListGroup.Item>
                                        </Form.Group>
                                        <Row>
                                            <Form.Label column sm="4" style={{textAlign: "center"}}>
                                                설명
                                            </Form.Label>
                                            <Col>
                                                <ListGroup.Item>{road.description}</ListGroup.Item>
                                            </Col>
                                        </Row>
                                        <Form.Group as={Row} style={{textAlign: "center"}}>
                                            <Form.Label column sm="4">
                                                위치 타입
                                            </Form.Label>
                                            <ListGroup.Item>{getPrimaryPosition(road)}</ListGroup.Item>
                                            <ListGroup.Item>{road.secondaryPositionType}</ListGroup.Item>
                                        </Form.Group>
                                        <Form.Group as={Row} style={{textAlign: "center"}}>
                                            <Form.Label column sm="4">
                                                태그
                                            </Form.Label>
                                            {road.tags.map((tag, index) => (
                                                <ListGroupItem key={index}>#{tag}</ListGroupItem>))}
                                        </Form.Group>
                                    </Form>
                                    <p>등록일 : {road.publishingDate}</p>
                                </>
                            )}
                            {localInfo.visibleOnTabEstimate && <EstimateContainer/>}
                            {localInfo.visibleOnTabComment &&
                            <CommentContainer info={road} setUpdateCommentList={updateComment}/>}
                        </Col>
                    </Row>
                </div>
            </InfoWindow>}
            */}
            <Polyline path={road.roadInfo} options={selectPolyLineOption(road)} onMouseOver={onMouseOver}
                      onMouseOut={onMouseOver} onClick={onRoadClick}/>

        </>
    )
};

const RoadViewContainer = ({roadList}) => {

    useEffect(()=>{
        console.dir(roadList);
    }, [roadList]);

    if (!roadList) return null;



    return (
        <>
            <RoadViewList roadList={roadList}/>
        </>
    );

};

export default RoadViewContainer;
