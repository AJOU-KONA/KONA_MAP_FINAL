import React, {useCallback, useEffect, useState} from "react";
import {Button, Form, Row, Table} from "react-bootstrap";
import client from "../lib/api/client";

const UserCommentListItem = ({comment}) => {
    const [localInfo, setLocalInfo] = useState(comment);

    const onBlockClick = useCallback(() => {
        const patchBlock = async () => {
            try {
                await client.patch(`/api/admin/commentBlock/${localInfo._id}`, {
                    type: "comment",
                    block: localInfo.status.block === false ? true : false,
                });
            } catch (e) {
                console.dir(e);
            }
        };
        patchBlock();
        setLocalInfo({...localInfo, status : { ...localInfo.status,
                block :localInfo.status.block === false ? true : false}});
    }, [localInfo]);

    if(!localInfo) return null;

    return (
        <tr align="middle">
            <td>{localInfo.title}</td>
            <td>{localInfo.username}</td>
            <td>{localInfo.publishingDate}</td>
            {localInfo.status.block !== false ? <td className="bg-danger">차단</td> : <td>정상</td>}
            <td>{localInfo.status.block ? 5 : 0}</td>
            <td><Button variant="danger" onClick={onBlockClick}>차단</Button></td>
        </tr>

    );
};


const UserCommentList = ({userCommentList}) => {

    return (
        <Table striped bordered hover variant="white">
            <thead>
            <tr align="center">
                <th className="table-warning">제목</th>
                <th className="table-warning">등록자</th>
                <th className="table-warning">등록일</th>
                <th className="table-warning">상태</th>
                <th className="table-warning">신고</th>
                <th className="table-warning">차단</th>
            </tr>
            </thead>

            <tbody>
            {userCommentList.map(comment => (<UserCommentListItem key={comment._id}
                                                                  comment={comment}/>))}
            </tbody>

        </Table>
    )
};

const UsercommentManageComponent = ({userCommentList}) => {
    return <UserCommentList userCommentList={userCommentList}/>;
};

export default UsercommentManageComponent;
