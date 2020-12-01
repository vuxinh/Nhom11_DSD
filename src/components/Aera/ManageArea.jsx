import React from 'react';
import {compose, withProps} from "recompose"
import 'antd/dist/antd.css';
import {Table, Checkbox, Col, Row, Input, Select, Button, Modal} from 'antd';
import {SearchOutlined, DeleteOutlined, FolderAddOutlined} from '@ant-design/icons';
import {withRouter} from 'react-router'
import {
    withGoogleMap,
    withScriptjs,
    GoogleMap,
} from "react-google-maps";

const MyMapComponent = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyA15qz81pHiNfVEV3eeniSNhAu64SsJKgU",
        loadingElement: <div style={{height: `100%`}}/>,
        containerElement: <div style={{height: `400px`}}/>,
        mapElement: <div style={{height: `100%`}}/>,
    }),
    withScriptjs,
    withGoogleMap
)((props) =>
    <GoogleMap
        defaultZoom={8}
        defaultCenter={{lat: 21.0245, lng: 105.84117}}
        onClick={props.onMarkerClick}
    >
    </GoogleMap>
)

class ManageArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            arrayDelete: [],
            listArea: [
                {
                    key: 'KVGS1',
                    name: 'Khu vực giám sát 1',
                    total: 5
                },
                {
                    key: 'KVGS2',
                    name: 'Khu vực giám sát 2',
                    total: 2
                },
            ],
            openModalAdd: false,
            columns: [
                {
                    title: '',
                    key: 'key',
                    render: (val) => (
                        <Checkbox data-key={val.key} onChange={this.onChange}/>
                    ),
                },
                {
                    title: 'Mã khu vực',
                    dataIndex: 'key',
                    key: 'key',
                    render: text => <a onClick={() => {
                        this.editArea(text)
                    }}>{text}</a>
                },
                {
                    title: 'Tên khu vực',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: 'Số miền trong khu vực',
                    key: 'total',
                    dataIndex: 'total',
                },
            ],
            create: {
                startPoint: {
                    lat: '123',
                    long: '234',
                },
                endPoint: {
                    lat: '456',
                    long: '567',
                },
            },
        };
        this.onChange = this.onChange.bind(this);
        this.editArea = this.editArea.bind(this);
        this._handleChange = this._handleChange.bind(this);
    }

    delayedShowMarker = () => {
        setTimeout(() => {
            this.setState({isMarkerShown: true})
        }, 3000)
    }
    
    handleMarkerClick = (e) => {
        let startPoint = {}; 
        startPoint.lat = e.latLng.lat();
        startPoint.long = e.latLng.lng();
        this.setState({isMarkerShown: false});
        this.setState(prevState => {
            let create = Object.assign({}, prevState.create);
            create.startPoint.lat = startPoint.lat;
            create.startPoint.long = startPoint.long;
            return { create };
        })
        this.delayedShowMarker();
    }
    
    _handleChange(e) {
        let key = e.target.name;
        let value = e.target.value;
        this.setState(prevState => {
            let create = Object.assign({}, prevState.create);
            create[key] = value;
            return { create };
        })
    }
    
    setStatusModalAdd(openModalAdd) {
        this.setState({openModalAdd});
    }

    setStatusModalDelete(openModalDelete) {
        this.setState({openModalDelete});
    }
    
    onChange(e) {
        let val = e.target['data-key'];
        let status = e.target.checked;
        let arrayDelete = [...this.state.arrayDelete];
        if (status) {
            let index = arrayDelete.findIndex(elm => elm === val);
            if (index === -1) {
                arrayDelete.push(val);
                this.setState({arrayDelete: arrayDelete});
            }
        } else {
            let index = arrayDelete.findIndex(elm => elm === val);
            if (index !== -1) {
                arrayDelete.splice(index, 1);
                this.setState({arrayDelete: arrayDelete});
            }
        }
    }
    
    editArea(val) {
        let area = this.state.listArea.find(area => area.key === val);
        this.props.history.push({
            pathname: '/surveillance-area/detail',
            state: {
                area: area
            }
        });
    }
    
    render() {
        return (
            <div className="main">
                <div className="filter">
                    <Row>
                        <Col span={6}>
                            <Input style={{width: 250}} placeholder="Tìm kiếm" prefix={<SearchOutlined/>}/>
                        </Col>
                        <Col span={6}>
                            <Button type="primary" danger icon={<DeleteOutlined/>} style={{marginRight: 10}}
                                    onClick={() => this.setStatusModalDelete(true)}>
                                Xóa
                            </Button>
                            <Button type="primary" icon={<FolderAddOutlined/>}
                                    onClick={() => this.setStatusModalAdd(true)}>
                                Thêm mới
                            </Button>
                            <Modal
                                title="Thêm mới khu vực giám sát"
                                visible={this.state.openModalAdd}
                                onOk={() => this.setStatusModalAdd(false)}
                                onCancel={() => this.setStatusModalAdd(false)}
                                okText="Lưu"
                                cancelText="Hủy"
                                centered
                            >
                                <table className="table table-hover table-responsive table-borderless">
                                    <tr>
                                        <th style={{width: '50%'}}>Mã khu vực giám sát</th>
                                        <td>
                                            <Input style={{width: 200}} placeholder="Nhập"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th style={{width: '50%'}}>Tên khu vực giám sát</th>
                                        <td>
                                            <Input style={{width: 200}} placeholder="Nhập"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th style={{width: '50%'}}>Điểm cực Tây Bắc:</th>
                                    </tr>
                                    <tr>
                                        <th style={{width: '50%', paddingLeft: '30px'}}>Kinh độ</th>
                                        <td>
                                        <Input name="lng" value={this.state.create.startPoint.long} onChange={this._handleChange} style={{width: 200}} placeholder="Nhập"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th style={{width: '50%', paddingLeft: '30px'}}>Vĩ độ</th>
                                        <td>
                                        <Input name="lng" value={this.state.create.startPoint.lat} onChange={this._handleChange} style={{width: 200}} placeholder="Nhập"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th style={{width: '50%'}}>Điểm cực Đông Nam:</th>
                                    </tr>
                                    <tr>
                                        <th style={{width: '50%', paddingLeft: '30px'}}>Kinh độ</th>
                                        <td>
                                        <Input name="lng" value={this.state.create.endPoint.long} onChange={this._handleChange} style={{width: 200}} placeholder="Nhập"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th style={{width: '50%', paddingLeft: '30px'}}>Vĩ độ</th>
                                        <td>
                                        <Input name="lng" value={this.state.create.endPoint.lat} onChange={this._handleChange} style={{width: 200}} placeholder="Nhập"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th style={{width: '50%'}}>Chiều cao tối đa</th>
                                        <td>
                                            <Input style={{width: 200}} placeholder="Nhập"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th style={{width: '50%'}}>Chiều cao tối thiểu</th>
                                        <td>
                                            <Input style={{width: 200}} placeholder="Nhập"/>
                                        </td>
                                    </tr>
                                </table>
                                <div >
                                    <MyMapComponent
                                        isMarkerShown={this.state.isMarkerShown}
                                        onMarkerClick={this.handleMarkerClick}
                                    />
                                </div>
                            </Modal>
                        </Col>
                    </Row>
                </div>
                <br/>
                <div className="content">
                    <Table columns={this.state.columns} dataSource={this.state.listArea} rowKey="key"/>
                </div>
            </div>
        );
    }
}

export default withRouter(ManageArea);
