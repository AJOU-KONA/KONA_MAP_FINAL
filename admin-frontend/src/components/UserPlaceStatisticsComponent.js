import React from 'react';
import styled from "styled-components";
import {Table} from "react-bootstrap";

const StyledWrapper = styled.div`
    padding-left : 70px;
`;

const UserPlaceStatisticsComponent = ({userPlaceStatistics, userRoadStatistics, userBuildingStatistics,
                                          userBundleStatistics}) => {
    return (
        <StyledWrapper>
            <Table striped bordered hover variant="white">
                <thead>
                <tr align="center">
                    <th className="table-warning">등록된 위치 게시물</th>
                    <th className="table-warning">등록된 경로 게시물</th>
                    <th className="table-warning">등록된 건물 게시물</th>
                    <th className="table-warning">등록된 모음 게시물</th>
                </tr>
                </thead>
                <tbody>
                <td>{userPlaceStatistics.totalNumber}</td>
                <td>{userRoadStatistics.totalNumber}</td>
                <td>{userBuildingStatistics.totalNumber}</td>
                <td>{userBundleStatistics.totalNumber}</td>
                </tbody>
            </Table>
        </StyledWrapper>
    )
        ;
};

export default UserPlaceStatisticsComponent;
