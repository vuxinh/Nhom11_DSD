import React from 'react';
import {compose, withProps} from "recompose"
import 'antd/dist/antd.css';
import {Table, Checkbox, Col, Row, Input, Select, Button, Modal} from 'antd';
import {SearchOutlined, DeleteOutlined, FolderAddOutlined} from '@ant-design/icons';
import {withRouter} from 'react-router'
import { withGoogleMap, withScriptjs, GoogleMap,} from "react-google-maps";
import axios from 'axios';

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
              /* {
                    code: 'KVGS1',
                    name: 'Khu vực giám sát 1',
                    total: 5
                },
                {
                    code: 'KVGS2',
                    name: 'Khu vực giám sát 2',
                    total: 2
                },*/
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
                    dataIndex: 'code',
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
                    latitude: 123,
                    longitude: 234,
                },
                endPoint: {
                    latitude: 456,
                    longitude: 567,
                },
                name: 'Nui NamDL',
                code: 'namdl',
                maxHeight: 100,
                minHeight: 10,
                priority: 0
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
        startPoint.latitude = e.latLng.lat();
        startPoint.longitude = e.latLng.lng();
        this.setState({isMarkerShown: false});
        this.setState(prevState => {
            let create = Object.assign({}, prevState.create);
            create.startPoint.latitude = startPoint.latitude;
            create.startPoint.longitude = startPoint.longitude;
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

    componentDidMount() {
        axios.get(`https://monitoredzoneserver.herokuapp.com/area?page=0`)
          .then(res => {
            const list = res.data.content.monitoredArea;
            let listArea = [];
            let i = 0;
            for ( i = 0; i < list.length; i++){
              let Object = {
                  code: '',
                  name: '',
                  total: 0,
                  _id: ''
              };
              Object.code = list[i].code;
              Object.name = list[i].name;
              Object._id = list[i]._id;
              Object.total = list[i].monitoredZone.length;
              listArea.push(Object);
            }
            this.setState({
                listArea : listArea
            })
          })
          .catch(error => console.log(error));
      }
    
    setStatusModalAdd(openModalAdd) {
        let Object = {
            startPoint: {
                latitude: 123,
                longitude: 234,
            },
            endPoint: {
                latitude: 456,
                longitude: 567,
            },
            name: 'Nui NamDL',
            code: 'namdl',
            maxHeight: 100,
            minHeight: 10,
            priority: 0
        };
        Object.startPoint.latitude = this.state.create.startPoint.latitude;
        Object.endPoint.latitude = this.state.create.endPoint.latitude;
        Object.startPoint.longitude = this.state.create.startPoint.longitude;
        Object.endPoint.longitude = this.state.create.endPoint.longitude;
        Object.name = this.state.create.name;
        Object.code = this.state.create.code;
        Object.maxHeight = this.state.create.maxHeight;
        Object.minHeight = this.state.create.minHeight;
        Object.priority = this.state.create.priority;
        Object = JSON.stringify(Object);
       axios.post(`https://monitoredzoneserver.herokuapp.com/area`, {Object} )
         /* .then(res => {

            })
          })*/
          .catch(error => console.log(error));
        console.log(this.state.create.startPoint.longitude);
        console.log(this.state.create.startPoint.latitude);
        console.log(this.state.create.name);
        console.log(this.state.create.code);
        console.log(this.state.create.maxHeight);
        console.log(this.state.create.minHeight);
        console.log(this.state.create.priority);
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
                                            <Input name = 'code' style={{width: 200}} onChange={this._handleChange} placeholder="Nhập"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th style={{width: '50%'}}>Tên khu vực giám sát</th>
                                        <td>
                                            <Input name = 'name' style={{width: 200}} onChange={this._handleChange} placeholder="Nhập"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th style={{width: '50%'}}>Điểm cực Tây Bắc:</th>
                                    </tr>
                                    <tr>
                                        <th style={{width: '50%', paddingLeft: '30px'}}>Kinh độ</th>
                                        <td>
                                        <Input  value={this.state.create.startPoint.longitude} onChange={this._handleChange} style={{width: 200}} placeholder="Nhập"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th style={{width: '50%', paddingLeft: '30px'}}>Vĩ độ</th>
                                        <td>
                                        <Input  value={this.state.create.startPoint.latitude} onChange={this._handleChange} style={{width: 200}} placeholder="Nhập"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th style={{width: '50%'}}>Điểm cực Đông Nam:</th>
                                    </tr>
                                    <tr>
                                        <th style={{width: '50%', paddingLeft: '30px'}}>Kinh độ</th>
                                        <td>
                                        <Input  value={this.state.create.endPoint.longitude} onChange={this._handleChange} style={{width: 200}} placeholder="Nhập"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th style={{width: '50%', paddingLeft: '30px'}}>Vĩ độ</th>
                                        <td>
                                        <Input value={this.state.create.endPoint.latitude} onChange={this._handleChange} style={{width: 200}} placeholder="Nhập"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th style={{width: '50%'}}>Chiều cao tối đa</th>
                                        <td>
                                            <Input name = 'maxHeight' style={{width: 200}} onChange={this._handleChange}  placeholder="Nhập"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th style={{width: '50%'}}>Chiều cao tối thiểu</th>
                                        <td>
                                            <Input name = 'minHeight' style={{width: 200}} onChange={this._handleChange} placeholder="Nhập"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th style={{width: '50%'}}>Độ ưu tiên</th>
                                        <td>
                                            <Input name = 'priority' style={{width: 200}} onChange={this._handleChange} placeholder="Nhập"/>
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
