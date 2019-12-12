import React, {useCallback, useEffect, useState} from 'react';
import {Button, Table, Row} from 'react-bootstrap';
import {useDispatch} from "react-redux";
import {setBlock, setWatch} from "../modules/auth";

const getUserStatus = (userInfo) => {
    if (!userInfo.status.block && !userInfo.status.watch) return '정상';
    else if (userInfo.status.block) return '차단';
    else return '감시';
};
const UserListItem = ({userInfo}) => {
    const [localInfo, setLocalInfo] = useState(userInfo);
    const dispatch = useDispatch();

    const onWatchClick = useCallback(() => {
        if (getUserStatus(localInfo) === '감시') {
            setLocalInfo({...localInfo, status: {watch: false, block: localInfo.status.block}});
            dispatch(setWatch({username: userInfo.username, status: false}));
        } else {
            setLocalInfo({...localInfo, status: {watch: true, block: localInfo.status.block}});
            dispatch(setWatch({username: userInfo.username, status: true}));
        }
    }, [localInfo.status]);

    const onBlockClick = useCallback(() => {
        if (getUserStatus(localInfo) === '차단') {
            setLocalInfo({...localInfo, status: {block: false, watch: localInfo.status.watch}});
            dispatch(setBlock({username: userInfo.username, status: false}));
        } else {
            setLocalInfo({...localInfo, status: {block: true, watch: localInfo.status.watch}});
            dispatch(setBlock({username: userInfo.username, status: true}));
        }
    }, [localInfo.status]);

    useEffect(() => {
        console.dir(localInfo);
    }, [localInfo]);

    if (localInfo.username === 'admin') return null;

    return (
        <tr align="middle">
            <td>{localInfo.username}</td>
            <td>{localInfo.firstLivingArea}<br/>{localInfo.secondLivingArea}</td>
            <td>{localInfo.age}</td>
            <td>{localInfo.gender}</td>
            <td>{localInfo.warningCount}</td>
            {getUserStatus(localInfo) === '정상' && <td>{getUserStatus(localInfo)}</td>}
            {getUserStatus(localInfo) === '감시' && <td className="bg-warning">{getUserStatus(localInfo)}</td>}
            {getUserStatus(localInfo) === '차단' && <td className="bg-danger">{getUserStatus(localInfo)}</td>}
            <Row align="center" style={{paddingLeft: 20, paddingTop: 15, justifyContent: "center"}}>
                {getUserStatus(localInfo) === '정상' && <Button variant="warning" onClick={onWatchClick}>경고</Button>}
                {getUserStatus(localInfo) === '정상' && <Button variant="danger" onClick={onBlockClick}>차단</Button>}
                {getUserStatus(localInfo) === '감시' && <Button variant="warning" onClick={onWatchClick}>감시 해체</Button>}
                {getUserStatus(localInfo) === '차단' && <Button variant="danger" onClick={onBlockClick}>차단 해체</Button>}
            </Row>
        </tr>
    )
};

const UserList = ({userInfoList}) => {
    return (
        <Table striped bordered hover variant="white">
            <thead>
            <tr align="center">
                <th className="table-warning">아이디</th>
                <th className="table-warning">사는 곳</th>
                <th className="table-warning">나이</th>
                <th className="table-warning">성별</th>
                <th className="table-warning">신고</th>
                <th className="table-warning">현재상태</th>
                <th className="table-warning">경고/차단</th>
            </tr>
            </thead>
            <tbody>
            {userInfoList.map(info => (<UserListItem key={info._id} userInfo={info}/>))}
            </tbody>
        </Table>

    )
}

const UserManagerComponent = ({userInfoList}) => {
    return (
        <UserList userInfoList={userInfoList}/>
    )
};

export default UserManagerComponent;
