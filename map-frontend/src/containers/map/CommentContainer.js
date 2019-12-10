import React, {useCallback, useEffect, useState} from "react";
import CommentEditor from "../../components/map/CommentEditor";
import {Button, ListGroupItem, ListGroup, Row, Col, Table} from "react-bootstrap";
import {useSelector} from "react-redux";
import client from "../../lib/api/client";

const CommentContainer = ({commentList, UpdateCommentList, placeObjectId}) => {

    return (
        <div style={{paddingTop: "5px"}}>
            <CommentList commentList={commentList} UpdateCommentList={UpdateCommentList} placeObjectId={placeObjectId}/>
            <CommentEditor commentList={commentList} UpdateCommentList={UpdateCommentList}
                           placeObjectId={placeObjectId}/>
        </div>
    );
};

const CommentList = ({commentList, UpdateCommentList, placeObjectId}) => {

    return (
        <>
            {commentList && commentList.map((comment, index) => (
                <CommentListItem commentList={commentList} placeObjectId={placeObjectId}
                                 comment={comment} key={index} UpdateCommentList={UpdateCommentList}/>
            ))}
            <hr/>
        </>
    )
};

const CommentListItem = ({comment, commentList, UpdateCommentList}) => {
    const {username} = useSelector(({user}) => ({
        username : user.user.username
    }));

    const onRemoveClick = useCallback(() => {
        UpdateCommentList(commentList.filter(item => item.body !== comment.body));
    }, [commentList]);

    const onWarningClick = useCallback(() => {
        let arr = [];
        commentList.forEach(function(element){
            if(element._id === comment._id){
                arr = arr.concat({
                    ...element, status : { block: false, warningCount : element.status.warningCount + 1}
                })
            } else {
                arr = arr.concat(element);
            }
        });
        UpdateCommentList(arr);
    }, [commentList]);

    useEffect(() => {
        console.dir(comment);
    }, [comment]);


    if(!comment) return null;

    return (
        <Row>
            <Col sm={9}>
                {!comment.status.block && (comment.status.warningCount === 0 )
                    && <ListGroup.Item>{comment.title}</ListGroup.Item>}
                {!comment.status.block && (comment.status.warningCount > 0  )
                && <ListGroup.Item variant="warning">{comment.title}</ListGroup.Item>}
                {comment.status.block
                    && <ListGroup.Item variant="danger">{comment.title}</ListGroup.Item>}
            </Col>
            <Col sm={3}>
                {username === comment.username ?
                    <Button variant="danger" onClick={onRemoveClick}>삭제</Button>
                    : <Button variant="warning" onClick={onWarningClick}>신고</Button>}

            </Col>
        </Row>
    );
};


export default CommentContainer;
