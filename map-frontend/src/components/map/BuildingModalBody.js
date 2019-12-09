import React, {useEffect} from 'react';
import {Col, Form, ListGroup, ModalBody, Row} from "react-bootstrap";
import ImageUpload from "../common/ImageUpload";
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
