import React, {useCallback, useEffect, useReducer, useState} from 'react';
import {Modal, ModalBody, ModalTitle, ModalFooter, Button, Form, ListGroup, Row, Col} from "react-bootstrap";
import {MapCircleInfo} from "../map/MapCircle";
import ImageUpload from "./ImageUpload";
import MapTagBox from "../map/MapTagBox";
import client from "../../lib/api/client";

const selectOptions = {
    excercise: ["축구", "농구", "배구", "야구", "볼링"],
    education: ["유치원", "초등학교", "중학교", "대학교", "대학원", "교육원"],
    entertainment: ["PC방", "오락실", "노래방", "당구장"],
    food: ["학생식당", "음식점", "매점", "취식가능지역"],
    transport: ["공공버스", "학교버스", "지하철", "택시", "카풀"],
};

const SecondarySelect = ({primarySelect}) => {
    let secondOption;
    switch (primarySelect) {
        case "excercise" :
            secondOption = selectOptions.excercise;
            break;
        case "education" :
            secondOption = selectOptions.education;
            break;
        case "entertainment" :
            secondOption = selectOptions.entertainment;
            break;
        case "food" :
            secondOption = selectOptions.food;
            break;
        case "transport" :
            secondOption = selectOptions.transport;
            break;
        default :
            secondOption = selectOptions.excercise;
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
    tags: [],
    primaryPositionType: "excercise",
    secondaryPositionType: "축구",
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
        case 'updateDescription': {
            return {...state, description: action.description}
        }
        case 'updateDetailedPosition': {
            return {...state, detailedPosition: action.detailedPosition}
        }
        case 'updateGridPosition': {
            return {
                ...state, gridPosition: {
                    lat: parseFloat(action.gridPosition.lat),
                    lng: parseFloat(action.gridPosition.lng)
                }
            }
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
        default: {
            throw new Error(`unexpected action.type: ${action.type}`)
        }
    }
};

const MarkerModal = ({onLeftClick, position, radius, circle, setCircle}) => {
    const [localInfo, setLocalInfo] = useReducer(infoReducer, initialState);
    const [showCircleForm, setShowCircleForm] = useState(true);
    const [show, setShow] = useState(true);

    const reset = () => setLocalInfo({type: 'reset'});
    const updateName = (e) => setLocalInfo({type: 'updateName', name: e.target.value});
    const updateDescription = e => setLocalInfo({type: 'updateDescription', description: e.target.value});
    const updateDetailedDescription = e => setLocalInfo({
        type: 'updateDetailedPosition',
        detailedPosition: e.target.value
    });
    const updateGridPosition = position => setLocalInfo({
        type: 'updateGridPosition',
        gridPosition: position
    });
    const updateTags = newtag => setLocalInfo({type: 'updateTags', tags: newtag});
    const updatePrimaryPositionType = e => {
        setLocalInfo({type: 'updatePrimaryPositionType', primaryPositionType: e.target.value});
    };
    const updateSecondaryPositionType = e => {
        setLocalInfo({type: 'updateSecondaryPositionType', secondaryPositionType: e.target.value});
    };
    const setRadius = radius => {
        setLocalInfo({type: 'updateRadius', radius: radius});
    };

    const radiusButtonClick = useCallback(() => {

        handleShow();
        if (!circle) setCircle(true);
    }, [show]);

    const handleShow = useCallback(() => {
        if (!show) setShow(true);
        else setShow(false);
    }, [show]);

    useEffect(() => {
        setRadius(radius);
    }, [radius]);
    useEffect(() => {
        updateGridPosition(position);
    }, [position]);

    const onSubmit = useCallback(
        e => {
            e.preventDefault();
            console.dir(localInfo);
            const saveData = async () => {
                await client.post('/api/map', ({
                    name: localInfo.name,
                    description: localInfo.description,
                    position: localInfo.gridPosition,
                    tags: localInfo.tags,
                    detailedPosition: localInfo.detailedPosition,
                    primaryPositionType: localInfo.primaryPositionType,
                    secondaryPositionType: localInfo.secondaryPositionType,
                    radius: localInfo.radius,
                }));
            };
            saveData();
            reset();
            handleShow();
            setCircle(false);
        }, [localInfo]
    );


    return (
        <Modal show={show} centered onExited={onLeftClick} animation autoFocus restoreFocus
                           size="xl">
            <ModalTitle><strong>위치 정보 입력</strong></ModalTitle>
            <ModalBody>
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

                    <Form.Group controlId="photo">
                        <Form.Label>사진</Form.Label>
                        <ImageUpload/>
                    </Form.Group>

                    <Form.Group controlId="gridPosition">
                        <Form.Label>위치</Form.Label>
                        <ListGroup>
                            <ListGroup.Item>위도 : {position.lat}</ListGroup.Item>
                            <ListGroup.Item>경도 : {position.lng}</ListGroup.Item>
                        </ListGroup>
                    </Form.Group>

                    <Form.Group controlId="radius">
                        <Form.Label>범위 {localInfo.radius} m</Form.Label>
                        <Button variant="outline-primary" onClick={radiusButtonClick}>범위 추가하기</Button>
                    </Form.Group>

                    <Form.Group controlId="detailedPosition">
                        <Form.Label>세부 위치</Form.Label>
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
                                    <option value="excercise">운동</option>
                                    <option value="education">교육</option>
                                    <option value="entertainment">오락</option>
                                    <option value="food">음식</option>
                                    <option value="transport">교통</option>
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

    )
        ;
};

export default MarkerModal;
