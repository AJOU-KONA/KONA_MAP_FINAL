import React, {useCallback, useEffect, useState} from 'react';
import styled from "styled-components";
import {Form, Table} from "react-bootstrap";
import {firstLivingArea, firstLivingAreaKor, getLivingAreaEng} from '../lib/korLocation';

const StyledWrapper = styled.div`
    padding-left : 70px;
`;

const UserStatisticsBody = ({userStatistics, selectedAge, selectedArea}) => {


    useEffect(() => {
        console.dir(userStatistics);
    }, [userStatistics]);
    return (
        <tr align="middle">
            <td>{userStatistics.total}</td>
            <td>{userStatistics.gender.man}</td>
            <td>{userStatistics.gender.woman}</td>
            {selectedAge === 0 && <td>{userStatistics.age.zero}</td>}
            {selectedAge === 10 && <td>{userStatistics.age.one}</td>}
            {selectedAge === 20 && <td>{userStatistics.age.two}</td>}
            {selectedAge === 30 && <td>{userStatistics.age.three}</td>}
            {selectedAge === 40 && <td>{userStatistics.age.four}</td>}
            {selectedAge === 50 && <td>{userStatistics.age.five}</td>}
            {selectedAge === 60 && <td>{userStatistics.age.six}</td>}
            {selectedAge === 70 && <td>{userStatistics.age.seven}</td>}
            {selectedAge === 80 && <td>{userStatistics.age.eight}</td>}
            {selectedAge === 90 && <td>{userStatistics.age.nine}</td>}
        </tr>
    )
};

const UserLivingArea = ({userStatistics}) => {
    const [firstLivingArea, setFirstLivingArea] = useState("서울특별시");
    const [secondLivingArea, setSecondLivingArea] = useState("종로구");

    const onFirstLivingSelect = useCallback((e) => {
        setFirstLivingArea(e.target.value);
    }, [firstLivingArea]);

    const onSecondLivingSelect = useCallback((e) => {
        setSecondLivingArea(e.target.value);
    }, [secondLivingArea]);

    return (
        <tr align="center">
            <th>구역별 분류</th>
            <td>
                <Form.Control as="select" onChange={onFirstLivingSelect}>
                    {firstLivingAreaKor.map(area => <option value={area}>{area}</option>)}
                </Form.Control>
            </td>
            <td>
                <Form.Control as="select" onChange={onSecondLivingSelect}>
                    {getLivingAreaEng(firstLivingArea).map(area => <option value={area}>{area}</option>)}
                </Form.Control>
            </td>
            <td>

            </td>
        </tr>
    )
};

const UserStatisticsComponent = ({userStatistics}) => {
    const [selectedAge, setSelectedAge]  = useState(0);
    const [selectedArea, setSelectedArea] = useState(null);

    const onAgeChange = useCallback((e) => {
        setSelectedAge(Number(e.target.value));
    }, [selectedAge]);

    const onAreaChange = useCallback(e => {

    }, [selectedArea]);

    return (
        <StyledWrapper>
            <Table striped bordered hover variant="white">
                <thead>
                <tr align="center">
                    <th className="bg-warning">등록된 인원수</th>
                    <th className="bg-warning">남성</th>
                    <th className="bg-warning">여성</th>
                    <th className="bg-warning">
                        <Form.Control as="select" onChange={onAgeChange}>
                            <option value="0">10대 미만</option>
                            <option value="10">10대</option>
                            <option value="20">20대</option>
                            <option value="30">30대</option>
                            <option value="40">40대</option>
                            <option value="50">50대</option>
                            <option value="60">60대</option>
                            <option value="70">70대</option>
                            <option value="80">80대</option>
                            <option value="90">80대 이상</option>
                        </Form.Control>
                    </th>
                </tr>
                </thead>
                <tbody>
                <UserStatisticsBody userStatistics={userStatistics} selectedAge={selectedAge}/>
                </tbody>
            </Table>

            <div style={{paddingTop: 20}}/>

            <Table striped bordered hover variant="white">
                <thead>
                <tr align="center">
                    <th className="bg-warning"></th>
                    <th className="bg-warning">도</th>
                    <th className="bg-warning">시</th>
                    <th className="bg-warning">인원수</th>
                </tr>
                </thead>
                <thead>
                <tr align="center"></tr>
                <tr></tr>
                </thead>

                <tbody>
                    <UserLivingArea userStatistics={userStatistics}/>
                </tbody>
            </Table>
        </StyledWrapper>
    );
};

export default UserStatisticsComponent;
