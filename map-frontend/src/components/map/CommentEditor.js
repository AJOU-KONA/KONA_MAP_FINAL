import React, {useCallback, useEffect, useState} from "react";
import {Row, Col, Form, Button, InputGroup} from 'react-bootstrap';
import client from "../../lib/api/client";
import {GoPlus} from 'react-icons/go';
import {useSelector} from "react-redux";

const CommentEditor = ({commentList, UpdateCommentList, placeObjectId}) => {
    const [input, setInput] = useState('');

    const {username} = useSelector(({user}) => ({
        username: user.user.username
    }));

    const onChange = useCallback(
        e => {
            setInput(e.target.value);
        }, []);

    const onKeyPress = useCallback(
        e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                onClick();
            }
        }, [input]);

    const onClick = useCallback(
        () => {
            UpdateCommentList(commentList.concat({
                title: input,
                body: input,
                username: username,
                objectID: placeObjectId,
                status: { block : false, warningCount: 0, username : []}
            }));
            setInput('');
        }, [input]);

    return (
        <Row>
            <Col>
                <InputGroup className="mb-3">
                    <Form.Control
                        size="lg"
                        placeholder="댓글을 입력해주세요"
                        onKeyPress={onKeyPress}
                        onChange={onChange}
                        value={input}
                    />
                    <InputGroup.Append>
                        <Button variant="outline-primary" onClick={onClick}><GoPlus/></Button>
                    </InputGroup.Append>
                </InputGroup>
            </Col>
        </Row>

    );
};

export default CommentEditor;
