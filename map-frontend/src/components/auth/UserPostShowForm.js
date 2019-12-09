import React, {useEffect, useState} from 'react';
import {Button, Form, Table} from "react-bootstrap";
import client from "../../lib/api/client";


const PostListItem = ({post, selected, setDataList, dataList}) => {

    const onRemoveClick = () => {
        const removePost = async () => {
            try {
                const result = await client.patch('/api/map/removeInfo', {
                    id: post._id,
                    type: selected
                });
            } catch (e) {
                console.dir(e)
            }
        };
        removePost();
        setDataList(dataList.filter(data => data !== post));
    };

    return (

        <tr>
            <td>{post.name}</td>
            <td>{post.description}</td>
            <td>{post.detailedPosition}</td>
            <td>{post.primaryPositionType}</td>
            <td>{post.secondaryPositionType}</td>
            <td>
                <ul>
                    {post.tags.map((tag, index) => (<li key={index}>{tag}</li>))}
                </ul>
            </td>
            <td>{post.publishingDate}</td>
            <td>
                <Button variant="danger" onClick={onRemoveClick}>삭제</Button>
            </td>
        </tr>
    )
};
const PostList = ({
                      postList, bundleList, buildingList, roadList, setPostList,
                      setRoadList, setBuildingList, setBundleList
                  }) => {
    const [selected, setSelected] = useState("place");

    const onChange = e => {
        setSelected(e.target.value);
        console.dir(e.target.value);
    };

    return (
        <Table striped bordered hover variant="dark">
            <thead>
            <tr>
                <th>이름</th>
                <th>설명</th>
                <th>근처 위치</th>
                <th>종류</th>
                <th>세부종류</th>
                <th>태그</th>
                <th>작성일</th>
                <th>삭제</th>
                <th>
                    <Form.Control as="select" onChange={onChange}>
                        <option value="place">위치</option>
                        <option value="road">경로</option>
                        <option value="building">건물</option>
                        <option value="bundle">모음</option>
                    </Form.Control>
                </th>
            </tr>
            </thead>
            <tbody>
            {selected === 'building' && buildingList.map(post => (
                <PostListItem key={post._id} post={post} selected={selected}
                              setDataList={setBuildingList} dataList={buildingList}/>))}
            {selected === 'bundle' && bundleList.map(post => (
                <PostListItem key={post._id} post={post} selected={selected}
                              setDataList={setBundleList} dataList={bundleList}/>))}
            {selected === 'road' && roadList.map(post => (<PostListItem key={post._id} post={post} selected={selected}
                                                                        setDataList={setRoadList} dataList={roadList}/>))}
            {selected === 'place' && postList.map(post => (<PostListItem key={post._id} post={post} selected={selected}
                                                                         setDataList={setPostList} dataList={postList}/>))}
            </tbody>
        </Table>
    )
};

const UserPostShowForm = ({
                              postList, roadList, bundleList, buildingList, setPostList,
                              setBuildingList, setRoadList, setBundleList
                          }) => {
    return (
        <>
            <PostList postList={postList} roadList={roadList} buildingList={buildingList}
                      bundleList={bundleList} setPostList={setPostList} setBuildingList={setBuildingList}
                      setRoadList={setRoadList} setBundleList={setBundleList}/>
        </>
    )
};

export default UserPostShowForm;
