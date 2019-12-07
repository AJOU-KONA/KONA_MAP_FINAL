import React, {useCallback, useEffect, useReducer} from 'react';
import styled from "styled-components";
import {Button, Col, Nav, Row} from "react-bootstrap";
import CarouselContainer from "./CarouselContainer";
import {useDispatch, useSelector} from "react-redux";
import BasicInfoViewerContainer from "./BasicInfoViewerContainer";
import EstimateContainer from "./EstimateContainer";
import CommentContainer from "./CommentContainer";
import {FaStar, IoIosClose} from "react-icons/all";
import {addBookMark, removeFetchedData, setCommentList, setInfoViewer, updateBookMark} from "../../modules/map";
import client from "../../lib/api/client";

const StyledWrapper = styled.div`
    z-index: 20;
    background-color : white;
    position: fixed;
    right: 0;
    border-left : 2px solid;
    border-top : 2px solid;
`;

const BottomLine = styled.div`
    padding-top: 5px;
    border-bottom: black solid;
`;

const InfoWindowReducer = (state, action) => {
    switch (action.type) {
        case 'reset' : {
            return initialState
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
        case 'updateFilteredData': {
            return {...state, filteredData: action.filteredData}
        }
        default: {
            throw new Error(`unexpected action.type: ${action.type}`)
        }
    }
};

const initialState = {
    visibleOnTabPosition: true,
    visibleOnTabEstimate: false,
    visibleOnTabComment: false,
    isInBookMark: false,
    commentList: [],
    filteredData: null,
};

const InfoViewerContainer = () => {
    const [localInfo, setLocalInfo] = useReducer(InfoWindowReducer, initialState);
    const {
        placeInfo, roadInfo, buildingInfo, searchQueryType, storeCommentList,
        isMarkerClicked, isAddBookMark, buildingList, roadList, placeList
    } = useSelector(({map}) => ({
        searchQueryType: map.searchQuery.searchQueryType,
        roadInfo: map.roadInfo,
        placeInfo: map.placeInfo,
        buildingInfo: map.buildingInfo,
        storeCommentList: map.commentList,
        isMarkerClicked: map.isMarkerClicked,
        isAddBookMark: map.isAddBookMark,
        buildingList: map.bookMark.buildingList,
        roadList: map.bookMark.roadList,
        placeList: map.bookMark.placeList,

    }));

    const dispatch = useDispatch();
    const toggleTabEstimate = useCallback(() => {
        setLocalInfo({type: 'toggleTabEstimate'})
    }, []);
    const toggleTabComment = useCallback(() => {
        setLocalInfo({type: 'toggleTabComment'})
    }, []);
    const toggleTabPosition = useCallback(() => {
        setLocalInfo({type: 'toggleTabPosition'})
    }, []);
    const updateComment = useCallback((value) =>
            setLocalInfo({type: 'updateComment', comment: value}),
        [localInfo]);
    const updateFilteredData = useCallback((data) => {
        setLocalInfo({type: 'updateFilteredData', filteredData: data});
    }, []);
    const onCloseClick = useCallback(() => {
        console.dir(storeCommentList);
        const uploadComment = async () => {
            try {
                if (searchQueryType === 'place')
                    await client.patch(`/api/map/userPlace/comment/${localInfo.filteredData._id}`, {
                        commentList: storeCommentList
                    });
                if (searchQueryType === 'road')
                    await client.patch(`/api/map/userRoad/comment/${localInfo.filteredData._id}`, {
                        commentList: storeCommentList
                    });
                if (searchQueryType === 'building')
                    await client.patch(`/api/map/userBuilding/comment/${localInfo.filteredData._id}`, {
                        commentList: storeCommentList
                    });
            } catch (e) {
                console.dir(e);
            }
        };

        const updateCommentWarning = async () => {
            try {
                switch (searchQueryType) {
                    case 'place': {
                        await client.patch(`/api/map/warningComment/${placeInfo._id}`, {
                            commentList: storeCommentList,
                            type: "place"
                        });
                        break;
                    }
                    case 'road': {
                        await client.patch(`/api/map/warningComment/${roadInfo._id}`, {
                            commentList: storeCommentList,
                            type: "road"
                        });
                        break;
                    }
                    case 'building': {
                        await client.patch(`/api/map/warningComment/${buildingInfo._id}`, {
                            commentList: storeCommentList,
                            type: "building"
                        });
                        break;
                    }
                }
            } catch (e) {
                console.dir(e);
                alert('이미 신고하셨습니다');
            }
        };

        if (isMarkerClicked && storeCommentList !== []) {
            uploadComment();
            updateCommentWarning();
            dispatch(removeFetchedData());
            updateComment([]);
            dispatch(setCommentList([]));
        }
        dispatch(setInfoViewer(false));
    }, [dispatch, isMarkerClicked, storeCommentList, searchQueryType]);

    const addBookMarkClick = useCallback(() => {
        if (!isAddBookMark) {
            dispatch(addBookMark(true));
        }
        switch (searchQueryType) {
            case 'place':
                let updatePlace = placeList.concat(placeInfo);
                dispatch(updateBookMark({buildingList: buildingList, roadList: roadList, placeList: updatePlace}));
                break;
            case 'road':
                let updateRoad = roadList.concat(roadInfo);
                console.dir(updateRoad);
                dispatch(updateBookMark({buildingList: buildingList, roadList: updateRoad, placeList: placeList}));
                break;
            case 'building':
                let updateBuilding = buildingList.concat(buildingInfo);
                console.dir(updateBuilding);
                dispatch(updateBookMark({buildingList: updateBuilding, roadList: roadList, placeList: placeList}));
                break;
        }
    }, [isAddBookMark, placeList, roadList, buildingList, searchQueryType, placeInfo, roadInfo, buildingInfo]);

    useEffect(() => {
        if (searchQueryType === 'place' && placeInfo) updateFilteredData(placeInfo);
        if (searchQueryType === 'road' && roadInfo) updateFilteredData(roadInfo);
        if (searchQueryType === 'building' && buildingInfo) updateFilteredData(buildingInfo);
    }, [placeInfo, roadInfo, buildingInfo, searchQueryType]);

    useEffect(() => {
        if (localInfo.filteredData) console.dir(localInfo.filteredData.commentList);
        if (localInfo.filteredData && localInfo.filteredData.commentList.length !== 0) {
            updateComment(localInfo.filteredData.commentList);
        }
    }, [localInfo.filteredData]);

    useEffect(() => {
        dispatch(setCommentList(localInfo.commentList));
    }, [localInfo.commentList]);

    if (searchQueryType === 'road' && !localInfo.filteredData) return null;
    if (searchQueryType === 'place' && !localInfo.filteredData) return null;
    if (searchQueryType === 'building' && !localInfo.filteredData) return null;
    if (!localInfo.filteredData) return null;


    return (
        <StyledWrapper>
            <div style={{width: 1000, height: 700}}>
                <Row>
                    <Col>
                        <div style={{width: 500, height: 700}}>
                            <CarouselContainer info={localInfo.filteredData}/>
                        </div>
                    </Col>
                    <Col>
                        <div style={{width: 450, height: 700, paddingBottom: 20}}>
                            <Nav fill justify variant="pills" defaultActiveKey="info-position">
                                <Nav.Item>
                                    <Nav.Link eventKey="info-position"
                                              onSelect={toggleTabPosition}
                                    >위치 정보</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="estimate-user"
                                              onSelect={toggleTabEstimate}
                                    >평가</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="comment-user"
                                              onSelect={toggleTabComment}
                                    >댓글</Nav.Link>
                                </Nav.Item>
                                <Button variant="white" size="xl" onClick={addBookMarkClick}><FaStar/></Button>
                                <Button variant="white" onClick={onCloseClick} size="xl"><IoIosClose/></Button>
                            </Nav>
                            <BottomLine/>
                            {localInfo.visibleOnTabPosition &&
                            <BasicInfoViewerContainer info={localInfo.filteredData}/>}
                            {localInfo.visibleOnTabEstimate && <EstimateContainer info={localInfo.filteredData}/>}
                            {localInfo.visibleOnTabComment &&
                            <CommentContainer commentList={localInfo.commentList} UpdateCommentList={updateComment}
                                              placeObjectId={localInfo.filteredData._id}/>}
                        </div>
                    </Col>
                </Row>
            </div>
        </StyledWrapper>
    );
};

export default InfoViewerContainer;
