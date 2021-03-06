import React, {useCallback, useState} from "react";
import {Button, Row, Table} from "react-bootstrap";
import client from "../lib/api/client";


const UserPlaceListItem = ({userPlace}) => {
    const [localInfo, setLocalInfo] = useState(userPlace);

    const onBlockClick = useCallback(() => {
        const patchBlock = async () => {
            try {
                await client.patch(`/api/admin/block/${localInfo._id}`, {
                    type: "place",
                    block: localInfo.block === 0 ? 5 : 0,
                });
            } catch (e) {
                console.dir(e);
            }
        }
        patchBlock();
        setLocalInfo({...localInfo, block :localInfo.block === 0 ? 5 : 0});
    }, [localInfo]);

    return(
        <tr align="middle">
            <td>{localInfo.name}</td>
            <td>{localInfo.description}</td>
            <td>{localInfo.detailedPosition}</td>
            <td>{localInfo.position.lat}<br/>{localInfo.position.lng}</td>
            <td>{localInfo.tags.map((tag, index) => <li key={index}>{tag}</li>)}</td>
            <td>{localInfo.publishingDate}</td>
            <td>{localInfo.username}</td>
            <td>{localInfo.block}</td>
            {localInfo.block !== 0 ? <td className="bg-danger">차단</td> : <td>정상</td>}
            <td><Button variant="danger" onClick={onBlockClick}>차단</Button></td>
        </tr>
    );
};


const UserPlaceList = ({userPlaceList}) => {
    return(
        <Table striped bordered hover variant="white">
            <thead>
            <tr align="center">
                <th className="table-warning">이름</th>
                <th className="table-warning">설명</th>
                <th className="table-warning">상세한 설명</th>
                <th className="table-warning">위치</th>
                <th className="table-warning">태그</th>
                <th className="table-warning">등록일</th>
                <th className="table-warning">등록자</th>
                <th className="table-warning">신고</th>
                <th className="table-warning">상태</th>
                <th className="table-warning">차단</th>
            </tr>
            </thead>
            <tbody>
            {userPlaceList.map(place => (<UserPlaceListItem key={place._id} userPlace={place}/>))}
            </tbody>
        </Table>
    )
};

const UserPlaceManageComponent = ({userPlaceList})=> {
    return ( <UserPlaceList userPlaceList={userPlaceList}/> );
};

export default UserPlaceManageComponent;
