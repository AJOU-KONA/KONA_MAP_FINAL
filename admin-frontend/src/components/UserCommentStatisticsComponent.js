import React from 'react';
import styled from "styled-components";
import {Table} from "react-bootstrap";

const StyledWrapper = styled.div`
    padding-left : 70px;
`;

const UserCommentStatisticsComponent = ({userCommentStatistics}) => {
    return (
        <StyledWrapper>
            <Table striped bordered hover variant="white">
                <thead>
                <tr align="center">
                    <th className="table-warning">등록된 댓글</th>
                </tr>
                </thead>
                <tbody>
                <td>{userCommentStatistics.totalNumber}</td>
                </tbody>
            </Table>
        </StyledWrapper>
    )
        ;
};

export default UserCommentStatisticsComponent;
