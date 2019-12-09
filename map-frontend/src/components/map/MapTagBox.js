import React, {useState, useCallback, useEffect} from 'react';
import {Row, Col, Button, InputGroup, FormControl, Alert} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const TagItem = React.memo(({tag, onRemove}) => (
    <Alert variant="danger" onClick={() => onRemove(tag)} dismissible>#{tag}</Alert>
));

const TagList = React.memo(({tags, onRemove}) => (
    <Row>
        {tags.map(tag => (<TagItem key={tag} tag={tag} onRemove={onRemove}/>))}
    </Row>
));

const MapTagBox = ({updateTags}) => {
    const [input, setInput] = useState('');
    const [localTags, setLocalTags] = useState([]);

    useEffect(() => {
        updateTags(localTags);
    }, [localTags]);

    const insertTag = useCallback(
        tag => {
            if (!tag) return;
            if (localTags.includes(tag)) return;
            setLocalTags([...localTags, tag]);
        }, [localTags],
    );

    const onRemove = useCallback(
        tag => {
            setLocalTags(localTags.filter(t => t !== tag));
        }, [localTags],
    );

    const onChange = useCallback(e => {
        setInput(e.target.value);
    }, []);

    const onSubmit = useCallback(
        e => {
            e.preventDefault();
            insertTag(input.trim());
            updateTags(localTags);
            setInput('');
        }, [input, localTags]
    );

    const onKeyPress = useCallback(
        e => {
            if (e.key === 'Enter') {
                onSubmit(e);
            }
        }, [input, insertTag]
    );

    return (
        <>
            <Row>
                <Col xs={6}>
                    <InputGroup className="mb-3">
                        <FormControl placeholder="태그를 입력해주세요(검색에 활용됩니다)" value={input} onChange={onChange}
                                     onKeyPress={onKeyPress}/>
                        <InputGroup.Append>
                            <Button variant="outline-secondary" onClick={onSubmit}>추가</Button>
                        </InputGroup.Append>
                    </InputGroup>
                    <TagList tags={localTags} onRemove={onRemove}/>
                </Col>
            </Row>
        </>
    );
};

export default MapTagBox;
