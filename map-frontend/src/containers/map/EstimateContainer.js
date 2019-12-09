import React, {useCallback, useEffect, useReducer, useState} from 'react';
import {IoIosThumbsUp, IoIosThumbsDown} from 'react-icons/io';
import {AiFillAlert} from 'react-icons/ai';
import {Button, Form, Row, Col} from "react-bootstrap";
import styled from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import {addWarning} from "../../modules/auth";
import client from "../../lib/api/client";

const ButtonWrapper = styled.div`
    padding-left: 5px;
`;

const CustomForm = ({label, onchange}) => {

    return (
        <Form.Group style={{paddingLeft: 10}} >
            <Row>
                <Col>
                    <Form.Label style={{paddingRight: 10}}>{label}</Form.Label>
                </Col>
                <Col>
                    <Form.Control as="select" name={label} onChange={onchange}>
                        {[0, 1, 2, 3, 4, 5].map(point =>
                            <option value={point} key={point}>{point}점</option>)}
                    </Form.Control>
                </Col>
            </Row>
        </Form.Group>
    )
};

const initialState = {
    warning: false,
    accuracy:  0,
    interest: 0,
    good: 0,
};

const EstimateReducer = (state, action) => {
    switch (action.type) {
        case 'reset' : {
            return initialState;
        }
        case 'addWarning' : {
            return {...state, warning: !state.warning};
        }
        case 'accuracy' : {
            return {...state, accuracy: action.accuracy }
        }
        case 'interest' : {
            return {...state, interest: action.interest}
        }
        case 'good': {
            return {...state, good: action.good}
        }
        default: {
            throw new Error(`unexpected action.type: ${action.type}`)
        }
    }
};

const EstimateContainer = ({info}) => {
    const [localInfo, setLocalInfo] = useReducer(EstimateReducer, initialState);
    const {username} = useSelector(({user}) => ({
        username: user.user.username
    }));

    const dispatch = useDispatch();

    const onWarningClick = useCallback(() => {
        if (info.username === username) {
            alert('등록자는 신고할 수 없습니다');
            return;
        }
        setLocalInfo({type: 'addWarning'})
    }, [localInfo.warning]);

    const onEstimateClick = useCallback(() => {
        const patchEstimate = async () => {
            try{
                let type;
                if(info.floor) type = 'building';
                else if (info.roadInfo) type = 'road';
                else if (info.position) type = 'place';
                else type = 'bundle';

                await client.patch(`/api/map/estimate/${info._id}`, {
                   good: Number(localInfo.good),
                   interest: Number(localInfo.interest),
                   accuracy: Number(localInfo.accuracy),
                    username: username,
                    type : type
                });
            }catch(e){
                console.dir(e);
                alert('이미 평가하셨습니다');
            }
        }
        patchEstimate();
    }, [localInfo]);

    const onGoodRecommendClick = useCallback(() => {
        const patchRecommend = async () => {
            try {
                await client.patch(`/api/map/userPlace/recommend/${info._id}`, {
                    good: true,
                    bad: false,
                    username: username
                });
            } catch (e) {
                console.dir(e);
                alert('이미 추천하셨습니다');
            }
        };
        patchRecommend();
    }, []);

    const onBadRecommendClick = useCallback(() => {
        const patchRecommend = async () => {
            try {
                await client.patch(`/api/map//userPlace/recommend/${info._id}`, {
                    good: false,
                    bad: true,
                    username: username
                });
            } catch (e) {
                console.dir(e);
                alert('이미 추천하셨습니다');
            }
        };
        patchRecommend();
    }, []);

    const onChange = (e, type) => {
        switch (type) {
            case 'accuracy': setLocalInfo({type: 'accuracy', accuracy : e.target.value}); break;
            case 'interest': setLocalInfo({type: 'interest', interest : e.target.value}); break;
            case 'good' : setLocalInfo({type: 'good', good: e.target.value}); break;
        }
    };

    useEffect(() => {
        if (localInfo.warning) {
            dispatch(addWarning(info.username));
        }
    }, [localInfo.warning]);

    useEffect(() => {
        console.dir(localInfo.accuracy);
        console.dir(localInfo.interest);
        console.dir(localInfo.good);
    }, [localInfo.accuracy, localInfo.interest, localInfo.good]);

    return (
        <div style={{paddingTop: 10}}>
            <Form >
                <CustomForm label="신뢰도" onchange={e =>{
                    let type = "accuracy";
                    onChange(e, type);}}/>
                <CustomForm label="유용도" onchange={e =>{
                    let type = "interest";
                    onChange(e, type); }}/>
                <CustomForm label="만족도" onchange={e =>{
                    let type = "good";
                    onChange(e, type); }}/>
                <Row style={{paddingLeft: 30}}>
                    <ButtonWrapper>
                        <Button onClick={onGoodRecommendClick}><IoIosThumbsUp/>좋아요</Button>
                    </ButtonWrapper>
                    <ButtonWrapper>
                        <Button onClick={onBadRecommendClick}><IoIosThumbsDown/>싫어요</Button>
                    </ButtonWrapper>
                    <ButtonWrapper>
                        <Button onClick={onWarningClick}><AiFillAlert/>신고</Button>
                    </ButtonWrapper>
                    <ButtonWrapper>
                        <Button onClick={onEstimateClick} variant="outline-info">평가 등록</Button>
                    </ButtonWrapper>
                </Row>
            </Form>
        </div>
    );
};

export default EstimateContainer;
