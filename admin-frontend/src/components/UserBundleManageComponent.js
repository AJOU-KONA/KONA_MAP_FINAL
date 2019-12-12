import React, {useCallback, useEffect, useState} from "react";
import {Button, Form, Row, Table} from "react-bootstrap";
import client from "../lib/api/client";

const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];

const getPosition = (info) => {
    if(info.placeList.length !== 0 ) {
        return info.placeList[0].position;
    } else if (info.roadList.length !== 0 ){
        return info.roadList[0].roadInfo[0];
    } else {
        return {lat: info.buildingPosition[0].north, lng: info.buildingPosition[0].east};
    }
};

const UserBundleListItem = ({userBundle}) => {
    const [localInfo, setLocalInfo] = useState(userBundle);

    const onBlockClick = useCallback(() => {
        const patchBlock = async () => {
            try {
                await client.patch(`/api/admin/block/${localInfo._id}`, {
                    type: "bundle",
                    block: localInfo.block === 0 ? 5 : 0,
                });
            } catch (e) {
                console.dir(e);
            }
        }
        patchBlock();
        setLocalInfo({...localInfo, block :localInfo.block === 0 ? 5 : 0});
    }, [localInfo]);

    if(!localInfo) return null;

    return (
        <tr align="middle">
            <td>{localInfo.name}</td>
            <td>{localInfo.description}</td>
            <td>{localInfo.address.stringAddress}</td>
            <td>{getPosition(localInfo).lat}<br/>{getPosition(localInfo).lng}</td>
            <td>{localInfo.tags.map((tag, index) => <li key={index}>{tag}</li>)}</td>
            <td>{localInfo.publishingDate}</td>
            <td>{localInfo.username}</td>
            {localInfo.block !== 0 ? <td className="bg-danger">차단</td> : <td>정상</td>}
            <td>{localInfo.block ? localInfo.block : 0}</td>
            <td><Button variant="danger" onClick={onBlockClick}>차단</Button></td>
        </tr>

    );
};


const UserBundleList = ({userBundleList}) => {

    return (
        <Table striped bordered hover variant="white">
            <thead>
            <tr align="center">
                <th className="table-warning">이름</th>
                <th className="table-warning">설명</th>
                <th className="table-warning">위치</th>
                <th className="table-warning">위/경도</th>
                <th className="table-warning">태그</th>
                <th className="table-warning">등록일</th>
                <th className="table-warning">등록자</th>
                <th className="table-warning">상태</th>
                <th className="table-warning">신고</th>
                <th className="table-warning">차단</th>
            </tr>
            </thead>

            <tbody>
            {userBundleList.map(bundle => (<UserBundleListItem key={bundle._id}
                                                               userBundle={bundle}/>))}
            </tbody>

        </Table>
    )
};

const UserBundleManageComponent = ({userBundleList}) => {
    return <UserBundleList userBundleList={userBundleList}/>;
};

export default UserBundleManageComponent;
