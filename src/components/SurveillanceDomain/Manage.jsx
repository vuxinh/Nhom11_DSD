import React from 'react';
import {compose, withProps} from "recompose"
import 'antd/dist/antd.css';
import {Table, Checkbox, Col, Row, Input, Select, Button, Modal} from 'antd';
import {SearchOutlined, DeleteOutlined, FolderAddOutlined} from '@ant-design/icons';
import {withRouter} from 'react-router';
import axios from 'axios';
import {
    withGoogleMap,
    withScriptjs,
    GoogleMap,
    Polygon
} from "react-google-maps";
const { TextArea } = Input;
const {Option} = Select;

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
        <Polygon
            path={props.triangleCoords}
            key={1}
            editable={true}
            options={{
                strokeColor: "#0000FF",
                strokeWeight: 1,
            }}
        />
    </GoogleMap>
)

class Manage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            triangleCoords: [],// chưa 4 diem hien thi tren ban do
            isMarkerShown: false,
            arrayDelete: [],
            listDomain: [],
            openModalAdd: false,
            openModalDelete: false,
            columns: [
                {
                    title: 'Mã miền',
                    render: val => <a onClick={() => {
                        this.editDomain(val._id)
                    }}>{val.code}</a>
                },
                {
                    title: 'Khu vực',
                    render: val => <p>{this.getNameArea(val.area)}</p>
                },
                {
                    title: 'Số lượng drone',
                    render: val => <p>{val.drone.length}</p>
                },
                {
                    title: '',
                    render: val => (
                        <Button type="primary" danger icon={<DeleteOutlined/>} style={{marginRight: 10}}
                                onClick={() => this.deleteZone(val._id)}>
                            Xóa
                        </Button>
                    )
                }
            ],
            listArea: [],
            create: {
                _id: '',
                data: {
                    "startPoint": {
                        "longitude": '',
                        "latitude": ''
                    },
                    "endPoint": {
                        "longitude": '',
                        "latitude": ''
                    },
                    "priority": '',
                    "desciption": "",
                    "code": "",
                    "level": 1
                }
            },
        };
        this.onChange = this.onChange.bind(this);
        this.editDomain = this.editDomain.bind(this);
        this._handleChange = this._handleChange.bind(this);
    }
    
    delayedShowMarker = () => {
        setTimeout(() => {
            this.setState({isMarkerShown: true})
        }, 3000)
    }
    
    handleMarkerClick = (e) => {
        //get kinh do vi do khi click ban do
        let lat = e.latLng.lat();
        let lng = e.latLng.lng();
        // check xem co ton tai startPoint va endPoint
        let latStartPoint = this.state.create.data.startPoint.latitude;
        let latEndPoint = this.state.create.data.endPoint.latitude;
        
        if(!latStartPoint) {
            this.setState(prevState => {
                let create = Object.assign({}, prevState.create);
                create.data.startPoint.latitude = lat;
                create.data.startPoint.longitude = lng;
                return {create};
            });
        } else if (!latEndPoint) {
            this.setState(prevState => {
                let create = Object.assign({}, prevState.create);
                create.data.endPoint.latitude = lat;
                create.data.endPoint.longitude = lng;
                return {create};
            });
        } else {
            this.setState(prevState => {
                let create = Object.assign({}, prevState.create);
                create.data.startPoint.latitude = lat;
                create.data.startPoint.longitude = lng;
                create.data.endPoint.latitude = '';
                create.data.endPoint.longitude = '';
                return {create};
            });
        }
        if(this.state.create.data.startPoint.latitude && this.state.create.data.endPoint.latitude) {
            let triangleCoords = [
                { lat: this.state.create.data.startPoint.latitude, lng: this.state.create.data.startPoint.longitude },
                { lat: this.state.create.data.startPoint.latitude, lng: this.state.create.data.endPoint.longitude },
                { lat: this.state.create.data.endPoint.latitude, lng: this.state.create.data.endPoint.longitude },
                { lat: this.state.create.data.endPoint.latitude, lng: this.state.create.data.startPoint.longitude },
            ];
            this.setState({triangleCoords});
        }
        this.setState({isMarkerShown: false});
        this.delayedShowMarker();
    }
    
    _handleChange(e) {
        let key = e.target.name;
        let value = e.target.value;
        this.setState(prevState => {
            let create = Object.assign({}, prevState.create);
            create.data[key] = value;
            return { create };
        })
    }
    
    setStatusModalAdd(openModalAdd) {
        this.setState({openModalAdd});
    }
    
    createDomain() {
        this.setStatusModalAdd(false);
        let dataCreate = this.state.create;
        axios.post(`https://monitoredzoneserver.herokuapp.com/monitoredzone/area`, dataCreate , {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(res => {
                if(res.data.success) {
                    this.getAllZone();
                }
            })
            .catch(error => console.log(error));
    }
    
    setStatusModalDelete(openModalDelete) {
        this.setState({openModalDelete});
    }
    
    getAllZone() {
        axios.get(`https://monitoredzoneserver.herokuapp.com/monitoredzone?pageSize=1000`)
            .then(res => {
                const listDomain = res.data.content.zone;
                this.setState({listDomain});
            })
            .catch(error => console.log(error));
        
    }
    
    deleteZone(id) {
        axios.delete(`https://monitoredzoneserver.herokuapp.com/monitoredzone/${id}`)
            .then(res => {
                if(res.data.success) {
                    this.getAllZone();
                }
            })
            .catch(error => console.log(error));
    }
    
    getArea() {
        axios.get(`https://monitoredzoneserver.herokuapp.com/area?pageSize=1000`)
            .then(res => {
                const listArea = res.data.content.monitoredArea;
                this.setState({listArea});
            })
            .catch(error => console.log(error));
    }
    
    getNameArea(id) {
        let area = this.state.listArea.find(area => area._id === id);
        if(area) {
            return area.name;
        } else {
            return id;
        }
    }
    
    componentDidMount() {
        this.delayedShowMarker();
        this.getArea();
        this.getAllZone();
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
    
    editDomain(id) {
        let domain = this.state.listDomain.find(domain => domain._id === id);
        domain.nameArea = this.getNameArea(domain.area);
        domain.desciption = domain.desciption ? domain.desciption : '';
        this.props.history.push({
            pathname: '/surveillance-domain-manage/edit',
            state: {
                domain: domain
            }
        });
    }
    
    toggleActive = name => value => {
        console.log("_id: ",value) // event is some data
        this.setState(prevState => {
            let create = Object.assign({}, prevState.create);
            create._id = value;
            return {create};
        })
    }
    
    render() {
        return (
            <div className="main">
                <div className="filter">
                    <Row>
                        <Col span={4}>
                            <Input style={{width: 150}} placeholder="Search" prefix={<SearchOutlined/>}/>
                        </Col>
                        <Col span={4}>
                            <Select placeholder="Độ ưu tiên" style={{width: 150}}>
                                <Option value="1">Độ ưu tiên 1</Option>
                                <Option value="2">Độ ưu tiên 2</Option>
                                <Option value="3">Độ ưu tiên 3</Option>
                            </Select>
                        </Col>
                        <Col span={4}>
                            <Select placeholder="Khu vực" style={{width: 150}}>
                                <Option value="1">Khu vực 1</Option>
                                <Option value="2">Khu vực 2</Option>
                                <Option value="3">Khu vực 3</Option>
                            </Select>
                        </Col>
                        <Col span={6}>
                            <Button type="primary" icon={<FolderAddOutlined/>}
                                    onClick={() => this.setStatusModalAdd(true)}>
                                Thêm mới
                            </Button>
                            <Modal
                                title="Thêm mới miền giám sát"
                                visible={this.state.openModalAdd}
                                onOk={() => this.createDomain()}
                                onCancel={() => this.setStatusModalAdd(false)}
                                okText="Lưu"
                                cancelText="Hủy"
                                centered
                            >
                                <table className="table table-hover table-responsive table-borderless">
                                    <tr>
                                        <th style={{width: '50%'}}>Khu vực giám sát</th>
                                        <td>
                                            <Select name="_id" placeholder="Khu vực" style={{width: 200}} onChange={this.toggleActive("Active!")}>
                                                {this.state.listArea.map(area => {
                                                    return <Option value={area._id}>{area.name}</Option>
                                                })}
                                            </Select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th style={{width: '50%'}}>Mã miền giám sát</th>
                                        <td>
                                            <Input name="code" style={{width: 200}} placeholder="Nhập" onChange={this._handleChange}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th style={{width: '50%'}}>Độ ưu tiên</th>
                                        <td>
                                            <Input name="priority" style={{width: 200}} placeholder="Nhập" onChange={this._handleChange}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th style={{width: '50%'}}>Mô tả</th>
                                        <td>
                                            <Input name="desciption" style={{width: 200}} placeholder="Nhập" onChange={this._handleChange}/>
                                        </td>
                                    </tr>
                                </table>
                                <br/>
                                <div>
                                    <MyMapComponent
                                        onMarkerClick={this.handleMarkerClick}
                                        triangleCoords={this.state.triangleCoords}
                                    />
                                </div>
                            </Modal>
                        </Col>
                    </Row>
                </div>
                <br/>
                <div className="content">
                    <Table columns={this.state.columns} dataSource={this.state.listDomain} rowKey="key"/>
                </div>
            </div>
        );
    }
}

export default withRouter(Manage);
