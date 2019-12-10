import React from 'react';
import {Form, ListGroup, ListGroupItem, Row} from "react-bootstrap";
import YoutubeContainer from "../common/YoutubeContainer";

const getPrimaryPosition = (position) => {
    switch (position) {
        case "excercise":
            return '운동';
        case "education":
            return '교육';
        case 'entertainment' :
            return '오락';
        case "food":
            return '음식';
        case "transport" :
            return '교통';
        case "restPlace":
            return "숙소";
        case "hospital" :
            return "병원";
        case "convenience" :
            return "편의시설";
        case "hairshop" :
            return "미용시설";
        default :
            return "없음";
    }
};

const BasicInfoViewerContainer = ({info}) => {
    return (
        <Form>
            <div style={{paddingTop: 10}}/>
            <Form.Group as={Row}>
                <Form.Label column sm="2" style={{textAlign: "center"}}>
                    이름
                </Form.Label>
                <ListGroup.Item>{info.floorArray ? info.floorArray[0].name : info.name}</ListGroup.Item>
            </Form.Group>
            <Form.Group as={Row}>
                <Form.Label column sm="2" style={{textAlign: "center"}}>
                    설명
                </Form.Label>
                <ListGroup.Item>{info.floorArray ? info.floorArray[0].description : info.description}</ListGroup.Item>
            </Form.Group>
            <Form.Group as={Row} style={{textAlign: "center"}}>
                <Form.Label column sm="2">
                    주소
                </Form.Label>
                <ListGroup horizontal>
                    <ListGroup.Item>{info.address.stringAddress}</ListGroup.Item>
                </ListGroup>
            </Form.Group>
            {/*
            <Form.Group as={Row} style={{textAlign: "center"}}>
                <Form.Label column sm="2">
                    위치 타입
                </Form.Label>
                <ListGroup.Item>{getPrimaryPosition(info.primaryPositionType)}</ListGroup.Item>
                <ListGroup.Item>{info.secondaryPositionType}</ListGroup.Item>
            </Form.Group>
            */}
            <Form.Group as={Row} style={{textAlign: "center"}}>
                <Form.Label column sm="2">
                    태그
                </Form.Label>
                <ListGroup horizontal>
                    {info.tags.map((tag, index) => (
                        <ListGroupItem key={index}>#{tag}</ListGroupItem>))}
                </ListGroup>
            </Form.Group>
            {info.radius &&
            <Form.Group as={Row} style={{textAlign: "center"}}>
                <Form.Label column sm="2">
                    반경
                </Form.Label>
                <ListGroup.Item>{info.radius} m</ListGroup.Item>
            </Form.Group>
            }

        </Form>
    );
};

export default BasicInfoViewerContainer;
