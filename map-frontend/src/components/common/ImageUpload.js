import React from 'react';
import ImageUploader from 'react-images-upload';
import {Button, Form, Row} from "react-bootstrap";
import client from "../../lib/api/client";

class ImageUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {pictures: []};
        this.onDrop = this.onDrop.bind(this);
        this.onClick = this.onClick.bind(this);
        this.handleFileInput = this.handleFileInput.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        //console.dir(this.props);
    }

    onDrop(e) {
        this.setState({
            pictures: e.target.files
        });
    }

    handleFileInput(e) {
        this.setState({
            pictures: e.target.files[0],
        })
    }

    onClick() {
        let formData = [this.state.pictures.length];
        let i;
        for (i = 0; i < this.state.pictures.length; i++) {
            formData[i] = new FormData();
            //console.dir(this.state.pictures[i]);
            formData[i].append('file', this.state.pictures[i]);
        }

        console.dir(formData);
        //formData.append('file', this.state.pictures);
        //console.dir(formData);
        let imageUrl = [];

        const uploadImage = async () => {
            const upload = async () => {
                for (i = 0; i < formData.length; i++) {
                    const result = await client.post('api/upload', formData[i]);
                    imageUrl[i] = result.data.url;
                    console.dir(result);
                }
            };
            await upload().then(res => {
                alert('업로드 성공');
                this.props.updateImageUrl(imageUrl);
            }).catch(err => alert('업로드 실패'));
        };
        uploadImage();
    };

    render() {
        return (
            <>
                <Row>
                    <div style={{paddingLeft: 20}}/>
                    <input type="file" name="file" multiple onChange={this.onDrop}/>
                    <Button type="button" onClick={this.onClick}>업로드 실행</Button>
                    <div style={{paddingLeft: 10}}/>
                    {this.props.isUploaded ?
                        <Button variant="outline-success">업로드 완료</Button> :
                        <Button variant="outline-danger">업로드 안됨</Button>}
                </Row>
            </>
        );
    }
}

export default ImageUpload;
