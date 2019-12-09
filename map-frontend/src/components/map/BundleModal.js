import React, {useCallback, useEffect, useReducer, useState} from 'react';
import {Modal, ModalBody, ModalTitle, ModalFooter, Button, Form, Row, Col, ListGroup} from "react-bootstrap";
import {useSelector} from "react-redux";
import client from "../../lib/api/client";
import ImageUpload from "../common/ImageUpload";
import AlertComponent from "../common/AlertComponent";
import MapTagBox from "./MapTagBox";


const selectOptions = {
    'mainRoad': ['4차로', '3차로', '2차로', '포장도로'],
    'smallRoad': ['지름길', '오솔길', '산길', '나무길'],
    'travelRoad': ['홀로 여행', '도보여행', '테마여행', '자전거여행', '반려견과 함께 여행'],
    'foodRoad': ['한식', '양식', '중식', '혼합', '기타'],
    'sightSeeingRoad': ['문화', '건축물', '음악'],
};

const SecondarySelect = ({primarySelect}) => {
    let secondOption;
    switch (primarySelect) {
        case 'mainRoad' :
            secondOption = selectOptions.mainRoad;
            break;
        case 'smallRoad' :
            secondOption = selectOptions.smallRoad;
            break;
        case 'travelRoad':
            secondOption = selectOptions.travelRoad;
            break;
        case 'foodRoad' :
            secondOption = selectOptions.foodRoad;
            break;
        case 'sightSeeingRoad' :
            secondOption = selectOptions.sightSeeingRoad;
            break;
        default :
            secondOption = selectOptions.mainRoad;
    }

    return (
        <>
            {secondOption.map((select, index) => (<option key={index} value={select}>{select}</option>))}
        </>
    );
};

const initialState = {
    name: '',
    description: '',
    gridPosition: {lat: 0, lng: 0},
    detailedPosition: '',
    loading: false,
    tags: [],
    primaryPositionType: "excercise",
    secondaryPositionType: "축구",
    username: null,
    imageUrl: [],
    youtubeUrl: null,
    splitedAddress: [],
    stringAddress: null,
};

const bundleReducer = (state, action) => {
    switch (action.type) {
        case 'reset': {
            return initialState
        }
        case 'updateName': {
            return {...state, name: action.name}
        }
        case 'updateDescription': {
            return {...state, description: action.description}
        }
        case 'updateDetailedPosition': {
            return {...state, detailedPosition: action.detailedPosition}
        }
        case 'updateRoadInfo' : {
            return {...state, roadInfo: action.roadInfo}
        }
        case 'updateTags': {
            return {...state, tags: action.tags}
        }
        case 'updatePrimaryPositionType': {
            return {...state, primaryPositionType: action.primaryPositionType}
        }
        case 'updateSecondaryPositionType' : {
            return {...state, secondaryPositionType: action.secondaryPositionType}
        }
        case 'updateRadius': {
            return {...state, radius: action.radius}
        }
        case 'updateAlert': {
            return {...state, alert: action.alert}
        }
        case 'updateUserName' : {
            return {...state, username: action.username}
        }
        case 'setLoading' : {
            return {...state, loading: action.loading}
        }
        case 'updateImageUrl' : {
            return {...state, imageUrl: action.imageUrl}
        }
        case 'updateYoutubeUrl' : {
            return {...state, youtubeUrl: action.youtubeUrl}
        }
        case 'updateSplitedAddress' : {
            return {...state, splitedAddress: action.splitedAddress}
        }
        case 'updateStringAddress' : {
            return {...state, stringAddress: action.stringAddress}
        }
        default: {
            throw new Error(`unexpected action.type: ${action.type}`)
        }
    }
};

const BundleModal = ({roadList, placeList, buildingList}) => {
    const [localInfo, setLocalInfo] = useReducer(bundleReducer, initialState);
    const [visibleAlert, setVisibleAlert] = useState(false);
    const [show, setShow] = useState(true);
    const {username} = useSelector(({user}) => ({
        username: user.user.username,
    }));

    const reset = () => setLocalInfo({type: 'reset'});
    const updateName = (e) => setLocalInfo({type: 'updateName', name: e.target.value});
    const updateDescription = e => setLocalInfo({type: 'updateDescription', description: e.target.value});
    const updateDetailedDescription = e => setLocalInfo({
        type: 'updateDetailedPosition',
        detailedPosition: e.target.value
    });
    const updateTags = newtag => setLocalInfo({type: 'updateTags', tags: newtag});
    const updatePrimaryPositionType = e => {
        setLocalInfo({type: 'updatePrimaryPositionType', primaryPositionType: e.target.value});
    };
    const updateSecondaryPositionType = e => {
        setLocalInfo({type: 'updateSecondaryPositionType', secondaryPositionType: e.target.value});
    };
    const setLoading = (value) => {
        setLocalInfo({type: 'setLoading', loading: value})
    };
    const updateImageUrl = (imageUrl) => {
        setLocalInfo({type: 'updateImageUrl', imageUrl: imageUrl});
    };
    const updateYoutubeUrl = (youtubeUrl) => {
        setLocalInfo({type: 'updateYoutubeUrl', youtubeUrl: youtubeUrl})
    };
    const updateSplitedAddress = (arr) => {
        setLocalInfo({type: 'updateSplitedAddress', splitedAddress: arr});
    };
    const updateStringAddress = (address) => {
        setLocalInfo({type: 'updateStringAddress', stringAddress: address});
    };

    const handleShow = useCallback(() => {
        if (!show) setShow(true);
        else setShow(false);
    }, [show]);


    useEffect(() => {
        if (placeList.length !== 0) {
            updateSplitedAddress(placeList[0].address.splitedAddress);
            updateStringAddress(placeList[0].address.stringAddress);
        } else if (roadList.length !== 0) {
            updateSplitedAddress(roadList[0].address.splitedAddress);
            updateStringAddress(roadList[0].address.stringAddress);
        } else {
            updateSplitedAddress(buildingList[0].address.splitedAddress);
            updateStringAddress(buildingList[0].address.stringAddress);
        }
    }, [placeList, buildingList, roadList]);

    const onSubmit = useCallback(
        e => {
            e.preventDefault();
            const saveData = async () => {

                await client.post('/api/map/userBundle', ({
                    name: localInfo.name,
                    description: localInfo.description,
                    tags: localInfo.tags,
                    detailedPosition: localInfo.detailedPosition,
                    primaryPositionType: localInfo.primaryPositionType,
                    secondaryPositionType: localInfo.secondaryPositionType,
                    username: username,
                    buildingList: buildingList,
                    roadList: roadList,
                    placeList: placeList,
                    address: {
                        stringAddress: localInfo.stringAddress,
                        splitedAddress: localInfo.splitedAddress
                    }
                }));
            };
            saveData();
            setVisibleAlert(true);
            handleShow();
            window.location.reload();
        }, [localInfo]);

    useEffect(() => {
        console.dir('처리됨');
        console.dir(localInfo.stringAddress);
    }, [localInfo.stringAddress]);

    return (
        <>
            <Modal show={show} centered animation autoFocus restoreFocus
                   size="lg">
                <ModalTitle><strong>위치 정보 입력</strong></ModalTitle>
                <ModalBody>

                    <Form.Group controlId="photo">
                        <Form.Label>사진</Form.Label>
                        <ImageUpload updateImageUrl={updateImageUrl}/>
                    </Form.Group>

                    <Form.Group controlId="photo">
                        <Form.Label>유투브 Url</Form.Label>
                        <Form.Control placeholder="유투브 url" name="updateName" onChange={updateYoutubeUrl}/>
                    </Form.Group>

                    <Form>
                        <Form.Group controlId="name">
                            <Form.Label>이름</Form.Label>
                            <Form.Control placeholder="이름을 입력해주세요" name="updateName" onChange={updateName}/>
                        </Form.Group>

                        <Form.Group controlId="description">
                            <Form.Label>설명</Form.Label>
                            <Form.Control placeholder="설명을 입력해주세요" name="description" as="textarea"
                                          onChange={updateDescription}/>
                        </Form.Group>

                        <Form.Group controlId="detailedPosition">
                            <Form.Label>세부 위치</Form.Label>
                            <ListGroup.Item>{localInfo.stringAddress}</ListGroup.Item>
                            <Form.Control placeholder="ex) 팔달관 근처, 도서관 정문 앞" name="detailedDescription"
                                          as="textarea"
                                          onChange={updateDetailedDescription}/>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>위치 타입</Form.Label>
                            <Form.Group as={Row}>

                                <Form.Group as={Col} controlId="positionType">
                                    <Form.Control as="select" onChange={updatePrimaryPositionType}
                                                  value={localInfo.primaryPositionType}>
                                        <option value="mainRoad">큰 도로</option>
                                        <option value="smallRoad">작은 도로</option>
                                        <option value="travelRoad">여행로</option>
                                        <option value="foodRoad">음식 추천로</option>
                                        <option value="sightSeeingRoad">관광</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group as={Col} controlId="SecondPositionType">
                                    <Form.Control as="select" onChange={updateSecondaryPositionType}
                                                  value={localInfo.secondaryPositionType}>
                                        <SecondarySelect primarySelect={localInfo.primaryPositionType}/>
                                    </Form.Control>
                                </Form.Group>
                            </Form.Group>
                        </Form.Group>
                        <MapTagBox updateTags={updateTags}/>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={handleShow}>닫기</Button>
                    <Button color="primary" onClick={onSubmit}>등록</Button>
                </ModalFooter>
            </Modal>
            {visibleAlert && <AlertComponent text="위치 정보가 등록되었습니다"/>}
        </>
    );
};

export default BundleModal;
