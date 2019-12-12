import React, {useCallback, useState} from 'react';
import styled from "styled-components";
import {Row} from 'react-bootstrap';
import {Form} from 'react-bootstrap';
import {firstLivingArea, firstLivingAreaKor, getLivingAreaEng} from '../../lib/korLocation';

const StyledWrapper = styled.div`
    padding-top: 0px;
`;

const UserInfoInsertForm = ({form, onChange}) => {

    const [secondOption, setSecondOption] = useState('서울특별시');

    const firstLivingAreaSelect = useCallback( e=> {
        setSecondOption(e.target.value);
        onChange(e);
    }, [secondOption]);

    return (
        <StyledWrapper>
            <Row>
                <Form inline style={{paddingTop: 10, paddingLeft: 15}}>
                    <Form.Label style={{paddingRight: 85}}>나이</Form.Label>
                    <Form.Control as="select" name="age" onChange={onChange}>
                        <option value={0}>10세 미만</option>
                        {[10, 20, 30, 40, 50, 60, 70, 80].map((value, index) =>
                            (<option key={index} value={value}>{value}대</option>))}
                        <option value={90}>90세 이상</option>
                    </Form.Control>
                </Form>

                <Form inline style={{paddingTop: 10}}>
                    <Form.Label style={{paddingRight: 30, paddingLeft: 40}}>성별</Form.Label>
                    <Form.Control as="select" onChange={onChange} name="gender">
                        <option value='남자'>남자</option>
                        <option value='여자'>여자</option>
                    </Form.Control>
                </Form>
                <Form inline style={{paddingTop: 10}}>
                    <Form.Label style={{paddingRight: 65, paddingLeft: 15}}>사는 곳</Form.Label>
                    <Form.Control as="select" onChange={firstLivingAreaSelect} name="firstLivingArea">
                        {firstLivingAreaKor.map((area, index) => (<option key={index} value={area}>
                            {area}</option>))}
                    </Form.Control>
                    <div style={{paddingLeft: 10}}/>
                    <Form.Control as="select" onChange={onChange} name="secondLivingArea">
                        {getLivingAreaEng(secondOption).map((area) =>
                            (<option value={area} key={area}>{area}</option>))}
                    </Form.Control>
                </Form>
            </Row>
        </StyledWrapper>
    )
};

export default UserInfoInsertForm;
