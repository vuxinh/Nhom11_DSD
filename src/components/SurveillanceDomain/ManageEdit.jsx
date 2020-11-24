import React from 'react';
import {compose, withProps} from "recompose"
import {withRouter} from 'react-router-dom';
import 'antd/dist/antd.css';
import {Input, Select, Tabs, Button, Checkbox, Table, Modal} from 'antd';
import {DeleteOutlined, FolderAddOutlined} from "@ant-design/icons";
import {GoogleMap, withGoogleMap, withScriptjs} from "react-google-maps";

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
    </GoogleMap>
)

class ManageEdit extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            olddomain: {
                ...this.props.location.state.domain,
                longitude: 100,
                latitude: 50,
                maxH: 10,
                minH: 5,
            },
            newdomain: {
                ...this.props.location.state.domain,
                longitude: 100,
                latitude: 50,
                maxH: 10,
                minH: 5,
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
                },                {
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
        console.log(this.state.newdomain);
        
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
            return { newdomain };
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
        this.setState(prevState => {
            let newdomain = Object.assign({}, prevState.newdomain);
            newdomain.latitude = lat;
            newdomain.longitude = lng;
            return { newdomain };
        })
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
                                        <Select placeholder="Khu vực" style={{width: 200}}>
                                            <Option value="1">Khu vực 1</Option>
                                            <Option value="2">Khu vực 2</Option>
                                            <Option value="3">Khu vực 3</Option>
                                        </Select>
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{width: '50%'}}>Mã miền giám sát</th>
                                    <td>
                                        <Input name="key" style={{width: 200}} placeholder="Nhập"
                                               value={this.state.newdomain.key}
                                               onChange={this._handleChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{width: '50%'}}>Tên miền giám sát</th>
                                    <td>
                                        <Input name="name" style={{width: 200}} placeholder="Nhập"
                                               value={this.state.newdomain.name} onChange={this._handleChange}/>
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{width: '50%'}}>Kinh độ</th>
                                    <td>
                                        <Input name="longitude" style={{width: 200}} placeholder="Nhập"
                                               value={this.state.newdomain.longitude} onChange={this._handleChange}/>
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{width: '50%'}}>Vĩ độ</th>
                                    <td>
                                        <Input name="latitude" style={{width: 200}} placeholder="Nhập"
                                               value={this.state.newdomain.latitude} onChange={this._handleChange}/>
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{width: '50%'}}>Chiều cao tối đa</th>
                                    <td>
                                        <Input name="maxH" style={{width: 200}} placeholder="Nhập"
                                               value={this.state.newdomain.maxH} onChange={this._handleChange}/>
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{width: '50%'}}>Chiều cao tối thiểu</th>
                                    <td>
                                        <Input name="minH" style={{width: 200}} placeholder="Nhập"
                                               value={this.state.newdomain.minH} onChange={this._handleChange}/>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <br/>
                        <div style={{height: "50vh", width: "50vh"}}>
                            <MyMapComponent
                                isMarkerShown={this.state.isMarkerShown}
                                onMarkerClick={this.handleMarkerClick}
                            />
                        </div>
                        <div className="action center">
                            <div className="save">
                                {
                                    !this.diff(this.state.olddomain, this.state.newdomain) && <Button type="primary">Lưu</Button>
                                }
                                {
                                    (this.diff(this.state.olddomain, this.state.newdomain)) && <Button disabled>Lưu</Button>
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
                                    <Table columns={this.state.columnsDrone} dataSource={this.state.listDrone} rowKey="key"/>
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
