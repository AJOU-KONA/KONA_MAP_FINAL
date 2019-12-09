import React, {useCallback, useEffect, useReducer, useState} from 'react';
import {
    Modal,
    ModalBody,
    ModalTitle,
    ModalFooter,
    Button,
    Form,
    Row, Col, ListGroup
} from "react-bootstrap";
import {useSelector} from "react-redux";
import client from "../../lib/api/client";
import ImageUpload from "../common/ImageUpload";
import AlertComponent from "../common/AlertComponent";
import MapTagBox from "./MapTagBox";
import BuildingModalBody from "./BuildingModalBody";

const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];

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
    detailedPosition: '',
    tags: [],
    primaryPositionType: "mainRoad",
    secondaryPositionType: "4차로",
    username: null,
    imageUrl: null,
    roughMapUrl: null,
    youtubeUrl: null,
    buildingPosition: null,
    floor: null,
    floorArray: [],
    splitedAddress: [],
    stringAddress: null,
    selectedFloor: 0,
};

const infoReducer = (state, action) => {
    switch (action.type) {
        case 'reset': {
            return initialState
        }
        case 'updateName': {
            return {...state, floorArray: action.floorArray}
        }
        case 'updateDescription': {
            return {...state, floorArray: action.floorArray}
        }
        case 'updateDetailedPosition': {
            return {...state, floorArray: action.floorArray}
        }
        case 'updateGridPosition': {
            return {
                ...state, gridPosition: {
                    lat: parseFloat(action.gridPosition.lat),
                    lng: parseFloat(action.gridPosition.lng)
                }
            }
        }
        case 'updateYoutubeUrl' : {
            return {...state, floorArray: action.floorArray}
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
        case 'updateImageUrl' : {
            return {...state, floorArray: action.floorArray}
        }
        case 'updateBuildingPosition' : {
            return {...state, buildingPosition: action.buildingPosition}
        }
        case 'updateFloor': {
            return {...state, floor: action.floor}
        }
        case 'updateRoughMap': {
            return {...state, floorArray: action.floorArray}
        }
        case 'setFloorArray': {
            return {...state, floorArray: action.arr};
        }
        case 'updateSplitedAddress' : {
            return {...state, splitedAddress: action.splitedAddress}
        }
        case 'updateStringAddress' : {
            return {...state, stringAddress: action.stringAddress}
        }
        case 'updateSelectedFloor' : {
            return {...state, selectedFloor: action.selectedFloor}
        }
        default: {
            throw new Error(`unexpected action.type: ${action.type}`)
        }
    }
};

const BuildingModal = ({buildingList, closeModal}) => {
    const [localInfo, setLocalInfo] = useReducer(infoReducer, initialState);
    const [visibleAlert, setVisibleAlert] = useState(false);
    const [show, setShow] = useState(true);
    const {username} = useSelector(({user}) => ({
        username: user.user.username,
    }));

    const reset = (index) => setLocalInfo({type: 'reset'});
    const updateName = (e) => {
        setLocalInfo({
            type: 'updateName', floorArray: localInfo.floorArray.map(
                item => item.floorNumber === localInfo.selectedFloor ?
                    {...item, name: e.target.value} : item)
        });
    };
    const updateDescription = e => {
        setLocalInfo({type: 'updateDescription',
            floorArray: localInfo.floorArray.map(
                item => item.floorNumber === localInfo.selectedFloor ?
                    {...item, description: e.target.value} : item)
    })};

    const updateDetailedDescription = e => setLocalInfo({
        type: 'updateDetailedPosition',
        floorArray: localInfo.floorArray.map(
            item => item.floorNumber === localInfo.selectedFloor ?
                {...item, detailedPosition: e.target.value} : item)
    });
    const updateTags = newtag => setLocalInfo({
        type: 'updateTags',
        tags: newtag
    });
    const updateImageUrl = (imageUrl) => {
        setLocalInfo({type: 'updateImageUrl',
            floorArray: localInfo.floorArray.map(
                item => item.floorNumber === localInfo.selectedFloor ?
                    {...item, imageUrl: imageUrl} : item)
        })};
    const updateRoughMap = (roughMapUrl) => {
        setLocalInfo({type: 'updateRoughMap',
            floorArray: localInfo.floorArray.map(
                item => item.floorNumber === localInfo.selectedFloor ?
                    {...item, roughMapUrl: roughMapUrl} : item)
        })};
    const updateYoutubeUrl = (e) => {
        setLocalInfo({type: 'updateYoutubeUrl',
            floorArray: localInfo.floorArray.map(
                item => item.floorNumber === localInfo.selectedFloor ?
                    {...item, youtubeUrl: e.target.value} : item)
        })};

    const updatePrimaryPositionType = e => {
        setLocalInfo({type: 'updatePrimaryPositionType', primaryPositionType: e.target.value});
    };
    const updateSecondaryPositionType = e => {
        setLocalInfo({type: 'updateSecondaryPositionType', secondaryPositionType: e.target.value});
    };
    const updateUserName = () => {
        setLocalInfo({type: 'updateUserName', username: username});
    };

    const updateBuildingList = () => {
        setLocalInfo({type: 'updateBuildingPosition', buildingPosition: buildingList});
    };
    const updateSelectedFloor = (e) => {
        setLocalInfo({type: 'updateSelectedFloor', selectedFloor: Number(e.target.value)});
    };
    const updateFloor = (e) => {
        setLocalInfo({type: 'updateFloor', floor: Number(e.target.value)});
        let arr = [];
        for (let i = 0; i < Number(e.target.value) +1 ; i++) {
            arr = arr.concat({
                imageUrl: null,
                roughMapUrl: null,
                youtubeUrl: null,
                name: '',
                description: '',
                detailedPosition: '',
                tags: [],
                floorNumber: i,
            });
        }
        setLocalInfo({type: 'setFloorArray', arr: arr});
    };

    const updateFormattedAddress = (arr) => {
        setLocalInfo({type: 'updateSplitedAddress', splitedAddress: arr});
    };
    const updateStringAddress = (address) => {
        setLocalInfo({type: 'updateStringAddress', stringAddress: address});
    };

    const handleShow = useCallback(() => {
        if (!show) setShow(true);
        else setShow(false);
    }, [show]);

    const onSubmit = useCallback(
        e => {
            e.preventDefault();
            console.dir(localInfo);
            const saveData = async () => {
                await client.post('/api/map/userBuilding', ({
                    tags: localInfo.tags,
                    primaryPositionType: localInfo.primaryPositionType,
                    secondaryPositionType: localInfo.secondaryPositionType,
                    username: localInfo.username,
                    buildingPosition: localInfo.buildingPosition,
                    floor: localInfo.floor,
                    floorArray: localInfo.floorArray,
                    address: {stringAddress: localInfo.stringAddress, splitedAddress: localInfo.splitedAddress}
                }));
            };
            saveData();
            setVisibleAlert(true);
            handleShow();
            window.location.reload();
        }, [localInfo, handleShow]);

    useEffect(() => {
        updateUserName(username);
        updateBuildingList();
    }, [username]);

    useEffect(() => {
        console.dir(localInfo.floorArray[localInfo.selectedFloor]);
    }, [localInfo]);

    useEffect(() => {
        const getAddress = async () => {
            try {
                const result = await client.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=
                ${buildingList[0].north},${buildingList[0].east}&key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}`);
                let arr = result.data.results[0].formatted_address.split(" ");
                updateStringAddress(result.data.results[0].formatted_address);
                updateFormattedAddress(arr);
            } catch (e) {
                console.dir(e)
            }
        };
        getAddress();
    }, [buildingList]);

    useEffect(() => {
        console.dir(localInfo.floorArray);
    }, [localInfo.floorArray]);

    return (
        <>
            <Modal show={show} centered animation autoFocus restoreFocus
                   onExited={closeModal}
                   size="lg">
                <ModalTitle><strong>위치 정보 입력</strong></ModalTitle>
                <div style={{paddingRight: 20, paddingLeft: 20}}>
                    <Form>
                        <Row>
                            <Col>
                                <Form.Control placeholder="층수를 입력해주세요" onChange={updateFloor}/>
                            </Col>
                            <Col>
                                {localInfo.floor &&
                                <Form.Control onChange={updateSelectedFloor} as="select" name="selectedFloor"
                                              style={{paddingRight: 10}}>
                                    {arr.slice(0, localInfo.floor+1).map(item =>
                                        item === 0 ? <option key={item} value={item}>요약</option> :
                                            <option key={item} value={item}>{item}층</option>)}
                                </Form.Control>}
                            </Col>
                        </Row>
                    </Form>
                </div>
                {localInfo.floor &&
                <ModalBody>
                    <Form>
                        <Form.Group controlId="photo">
                            <Form.Label>사진</Form.Label>
                            <ImageUpload updateImageUrl={updateImageUrl}
                                         isUploaded={localInfo.floorArray[localInfo.selectedFloor].imageUrl}
                                         selectedFloor={localInfo.selectedFloor}/>
                        </Form.Group>

                        <Form.Group controlId="photo">
                            <Form.Label>약도</Form.Label>
                            <ImageUpload updateImageUrl={updateRoughMap}
                                         isUploaded={localInfo.floorArray[localInfo.selectedFloor].roughMapUrl}
                                         selectedFloor={localInfo.selectedFloor}/>
                        </Form.Group>
                    </Form>
                    <Form>
                        <Form.Group controlId="name">
                            <Form.Label>이름</Form.Label>
                            <Form.Control placeholder="이름을 입력해주세요" name="updateName"
                                          onChange={updateName}
                                          value={localInfo.floorArray[localInfo.selectedFloor].name}
                            />
                        </Form.Group>

                        <Form.Group controlId="name">
                            <Form.Label>유튜브</Form.Label>
                            <Form.Control placeholder="유투브 url" name="updateUrl"
                                          onChange={updateYoutubeUrl}
                                          value={localInfo.floorArray[localInfo.selectedFloor].youtubeUrl}/>
                        </Form.Group>

                        <Form.Group controlId="description">
                            <Form.Label>설명</Form.Label>
                            <Form.Control placeholder="설명을 입력해주세요" name="description" as="textarea"
                                          onChange={updateDescription}
                                          value={localInfo.floorArray[localInfo.selectedFloor].description}/>
                        </Form.Group>

                        <Form.Group controlId="detailedPosition">
                            <Form.Label>세부 위치</Form.Label>
                            <ListGroup.Item>{localInfo.stringAddress}</ListGroup.Item>
                            <Form.Control placeholder="ex) 팔달관 근처, 도서관 정문 앞" name="detailedDescription"
                                          as="textarea"
                                          onChange={updateDetailedDescription}
                                          value={localInfo.floorArray[localInfo.selectedFloor].detailedPosition}/>
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

                </ModalBody>}

                <ModalFooter>
                    <Button color="secondary" onClick={handleShow}>닫기</Button>
                    <Button color="primary" onClick={onSubmit}>등록</Button>
                </ModalFooter>
            </Modal>
            {visibleAlert && <AlertComponent text="건물이 등록되었습니다"/>}
        </>
    );
};

export default BuildingModal;
