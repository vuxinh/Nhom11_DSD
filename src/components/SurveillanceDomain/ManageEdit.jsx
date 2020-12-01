import React from 'react';
import {compose, withProps} from "recompose"
import {withRouter} from 'react-router-dom';
import 'antd/dist/antd.css';
import {Input, Select, Tabs, Button, Checkbox, Table, Modal} from 'antd';
import {DeleteOutlined, FolderAddOutlined} from "@ant-design/icons";
import {GoogleMap, withGoogleMap, withScriptjs, Polygon} from "react-google-maps";
import axios from "axios";

const {TabPane} = Tabs
const {Option} = Select;

function callback(key) {
    console.log(key);
}

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

class ManageEdit extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            triangleCoords: [],
            olddomain: {
                ...this.props.location.state.domain
            },
            newdomain: {
                ...this.props.location.state.domain
            },
            columnsDrone: [
                {
                    title: '',
                    key: 'key',
                    render: (val) => (
                        <Checkbox data-key={val.key} onChange={this.onChange}/>
                    ),
                },
                {
                    title: 'Tên drone',
                    dataIndex: 'name',
                    key: 'name',
                    // render: text => <a onClick={() => { this.editDomain(text) }}>{text}</a>
                },
                {
                    title: 'Chiều cao tối đa',
                    dataIndex: 'maxH',
                    key: 'maxH',
                },
                {
                    title: 'Chiều cao tối thiểu',
                    dataIndex: 'minH',
                    key: 'minH',
                },
                {
                    title: 'Lịch bay',
                    key: 'date',
                    dataIndex: 'date',
                },
                {
                    title: 'Tốc độ tối đa',
                    key: 'maxSpeed',
                    dataIndex: 'maxSpeed',
                }, {
                    title: 'Thời gian bay tối đa',
                    key: 'maxFlightTime',
                    dataIndex: 'maxFlightTime',
                },
            ],
            listDrone: [
                {
                    name: 'Drone 1',
                    maxH: 50,
                    minH: 30,
                    date: '20/05/2020',
                    maxSpeed: 50,
                    maxFlightTime: '20/05/2020',
                },
                {
                    name: 'Drone 2',
                    maxH: 40,
                    minH: 20,
                    date: '20/05/2020',
                    maxSpeed: 50,
                    maxFlightTime: '20/05/2020',
                },
            ],
            openModalAdd: false,
            openModalDelete: false,
        }
        this._handleChange = this._handleChange.bind(this);
    }
    
    componentDidMount() {
        if (this.state.newdomain.startPoint.latitude && this.state.newdomain.endPoint.latitude) {
            let triangleCoords = [
                {lat: this.state.newdomain.startPoint.latitude, lng: this.state.newdomain.startPoint.longitude},
                {lat: this.state.newdomain.startPoint.latitude, lng: this.state.newdomain.endPoint.longitude},
                {lat: this.state.newdomain.endPoint.latitude, lng: this.state.newdomain.endPoint.longitude},
                {lat: this.state.newdomain.endPoint.latitude, lng: this.state.newdomain.startPoint.longitude},
            ];
            this.setState({triangleCoords});
        }
    }
    
    diff(obj1, obj2) {
        let difference = Object.keys(obj1).filter(k => obj1[k] !== obj2[k]);
        return difference.length === 0;
    }
    
    _handleChange(e) {
        let key = e.target.name;
        let value = e.target.value;
        this.setState(prevState => {
            let newdomain = Object.assign({}, prevState.newdomain);
            newdomain[key] = value;
            return {newdomain};
        })
    }
    
    setStatusModalAdd(openModalAdd) {
        this.setState({openModalAdd});
    }
    
    setStatusModalDelete(openModalDelete) {
        this.setState({openModalDelete});
    }
    
    handleMarkerClick = (e) => {
        
        let lat = e.latLng.lat();
        let lng = e.latLng.lng();
        let latStartPoint = this.state.newdomain.startPoint.latitude;
        let latEndPoint = this.state.newdomain.endPoint.latitude;
        if (!latStartPoint) {
            this.setState(prevState => {
                let newdomain = Object.assign({}, prevState.newdomain);
                newdomain.startPoint.latitude = lat;
                newdomain.startPoint.longitude = lng;
                return {newdomain};
            });
        } else if (!latEndPoint) {
            this.setState(prevState => {
                let newdomain = Object.assign({}, prevState.newdomain);
                newdomain.endPoint.latitude = lat;
                newdomain.endPoint.longitude = lng;
                return {newdomain};
            });
        } else {
            this.setState(prevState => {
                let newdomain = Object.assign({}, prevState.newdomain);
                newdomain.startPoint.latitude = lat;
                newdomain.startPoint.longitude = lng;
                newdomain.endPoint.latitude = '';
                newdomain.endPoint.longitude = '';
                return {newdomain};
            });
        }
        if (this.state.newdomain.startPoint.latitude && this.state.newdomain.endPoint.latitude) {
            let triangleCoords = [
                {lat: this.state.newdomain.startPoint.latitude, lng: this.state.newdomain.startPoint.longitude},
                {lat: this.state.newdomain.startPoint.latitude, lng: this.state.newdomain.endPoint.longitude},
                {lat: this.state.newdomain.endPoint.latitude, lng: this.state.newdomain.endPoint.longitude},
                {lat: this.state.newdomain.endPoint.latitude, lng: this.state.newdomain.startPoint.longitude},
            ];
            this.setState({triangleCoords});
        } else {
            let triangleCoords = [];
            this.setState({triangleCoords});
        }
    }
    
    save() {
        let dataEdit = {
            "data": {
                "startPoint": this.state.newdomain.startPoint,
                "endPoint": this.state.newdomain.endPoint,
                "priority": this.state.newdomain.priority,
                "desciption": this.state.newdomain.desciption,
                "code": this.state.newdomain.code,
            }
        }
        let idZone = this.state.newdomain._id;
        axios.put(`https://monitoredzoneserver.herokuapp.com/monitoredzone/${idZone}`, dataEdit, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(res => {
                this.props.history.push({
                    pathname: '/surveillance-domain-manage',
                });
            })
            .catch(error => console.log(error));
    }
    
    render() {
        return (
            <div className="main">
                <Tabs defaultActiveKey="1" onChange={callback}>
                    <TabPane tab="Cấu hình miền giám sát" key="1">
                        <div className="content">
                            <table className="table table-hover table-responsive table-borderless">
                                <tr>
                                    <th style={{width: '50%'}}>Khu vực giám sát</th>
                                    <td>
                                        <Input name="key" style={{width: 200}} placeholder="Nhập"
                                               value={this.state.newdomain.nameArea}
                                               disabled
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{width: '50%'}}>Mã miền giám sát</th>
                                    <td>
                                        <Input name="code" style={{width: 200}} placeholder="Nhập"
                                               value={this.state.newdomain.code}
                                               onChange={this._handleChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{width: '50%'}}>Độ ưu tiên</th>
                                    <td>
                                        <Input name="priority" style={{width: 200}} placeholder="Nhập"
                                               value={this.state.newdomain.priority} onChange={this._handleChange}/>
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{width: '50%'}}>Mô tả</th>
                                    <td>
                                        <Input name="desciption" style={{width: 200}} placeholder="Nhập"
                                               value={this.state.newdomain.desciption} onChange={this._handleChange}/>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <br/>
                        <div style={{width: "70vh"}}>
                            <MyMapComponent
                                onMarkerClick={this.handleMarkerClick}
                                triangleCoords={this.state.triangleCoords}
                            />
                        </div>
                        <br/>
                        <div className="action center">
                            <div className="save">
                                {
                                    !this.diff(this.state.olddomain, this.state.newdomain) &&
                                    <Button type="primary" onClick={() => this.save()}>Lưu</Button>
                                }
                                {
                                    (this.diff(this.state.olddomain, this.state.newdomain)) &&
                                    <Button disabled>Lưu</Button>
                                }
                            </div>
                        
                        </div>
                    </TabPane>
                    <TabPane tab="Danh sách drone" key="2">
                        <div className="filter">
                            <Button type="primary" danger icon={<DeleteOutlined/>} style={{marginRight: 10}}
                                    onClick={() => this.setStatusModalDelete(true)}>
                                Xóa
                            </Button>
                            <Button type="primary" icon={<FolderAddOutlined/>}
                                    onClick={() => this.setStatusModalAdd(true)}>
                                Thêm mới
                            </Button>
                            <Modal
                                title="Thêm Drone mới"
                                visible={this.state.openModalAdd}
                                onOk={() => this.setStatusModalAdd(false)}
                                onCancel={() => this.setStatusModalAdd(false)}
                                okText="Lưu"
                                width={650}
                                cancelText="Hủy"
                                centered
                            >
                                <div className="content">
                                    <Table columns={this.state.columnsDrone} dataSource={this.state.listDrone}
                                           rowKey="key"/>
                                </div>
                            </Modal>
                            <Modal
                                title="Bạn có thật sự muốn xóa không ?"
                                visible={this.state.openModalDelete}
                                onOk={() => this.setStatusModalDelete(false)}
                                onCancel={() => this.setStatusModalDelete(false)}
                                centered
                            >
                            </Modal>
                        </div>
                        <br/>
                        <div className="content">
                            <Table columns={this.state.columnsDrone} dataSource={this.state.listDrone} rowKey="key"/>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

export default withRouter(ManageEdit);
