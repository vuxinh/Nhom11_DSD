import React from 'react';
import {compose, withProps} from "recompose"
import 'antd/dist/antd.css';
import {Table, Checkbox, Col, Row, Input, Select, Button, Modal} from 'antd';
import {SearchOutlined, DeleteOutlined, FolderAddOutlined} from '@ant-design/icons';
import {withRouter} from 'react-router';
import {
    withGoogleMap,
    withScriptjs,
    GoogleMap,
} from "react-google-maps";

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
    </GoogleMap>
)

class Manage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isMarkerShown: false,
            arrayDelete: [],
            listDomain: [
                {
                    key: 'MGS1',
                    name: 'Miền giám sát 1',
                    area: 'Khu vực 1',
                    total: 5
                },
                {
                    key: 'MGS2',
                    name: 'Miền giám sát 2',
                    area: 'Khu vực 2',
                    total: 2
                },
            ],
            openModalAdd: false,
            openModalDelete: false,
            columns: [
                {
                    title: '',
                    key: 'key',
                    render: (val) => (
                        <Checkbox data-key={val.key} onChange={this.onChange}/>
                    ),
                },
                {
                    title: 'Mã miền',
                    dataIndex: 'key',
                    key: 'key',
                    render: text => <a onClick={() => {
                        this.editDomain(text)
                    }}>{text}</a>
                },
                {
                    title: 'Tên miền',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: 'Khu vực',
                    dataIndex: 'area',
                    key: 'area',
                },
                {
                    title: 'Số lượng drone',
                    key: 'total',
                    dataIndex: 'total',
                },
            ],
            create: {
                lat: '',
                lng: '',
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
        let lat = e.latLng.lat();
        let lng = e.latLng.lng();
        this.setState({isMarkerShown: false});
        this.setState(prevState => {
            let create = Object.assign({}, prevState.create);
            create.lat = lat;
            create.lng = lng;
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
    
    componentDidMount() {
        this.delayedShowMarker()
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
    
    editDomain(val) {
        let domain = this.state.listDomain.find(domain => domain.key === val);
        this.props.history.push({
            pathname: '/surveillance-domain-manage/edit',
            state: {
                domain: domain
            }
        });
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
                            <Button type="primary" danger icon={<DeleteOutlined/>} style={{marginRight: 10}}
                                    onClick={() => this.setStatusModalDelete(true)}>
                                Xóa
                            </Button>
                            <Button type="primary" icon={<FolderAddOutlined/>}
                                    onClick={() => this.setStatusModalAdd(true)}>
                                Thêm mới
                            </Button>
                            <Modal
                                title="Thêm mới miền giám sát"
                                visible={this.state.openModalAdd}
                                onOk={() => this.setStatusModalAdd(false)}
                                onCancel={() => this.setStatusModalAdd(false)}
                                okText="Lưu"
                                cancelText="Hủy"
                                centered
                            >
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
                                            <Input style={{width: 200}} placeholder="Nhập"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th style={{width: '50%'}}>Tên miền giám sát</th>
                                        <td>
                                            <Input style={{width: 200}} placeholder="Nhập"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th style={{width: '50%'}}>Kinh độ</th>
                                        <td>
                                            <Input name="lng" value={this.state.create.lng} onChange={this._handleChange} style={{width: 200}} placeholder="Nhập"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th style={{width: '50%'}}>Vĩ độ</th>
                                        <td>
                                            <Input name="lat" value={this.state.create.lat} onChange={this._handleChange} style={{width: 200}} placeholder="Nhập"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th style={{width: '50%'}}>Bán kính</th>
                                        <td>
                                            <Input style={{width: 200}} placeholder="Nhập"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th style={{width: '50%'}}>Độ ưu tiên</th>
                                        <td>
                                            <Input style={{width: 200}} placeholder="Nhập"/>
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
                            <Modal
                                title="Bạn có thật sự muốn xóa không ?"
                                visible={this.state.openModalDelete}
                                onOk={() => this.setStatusModalDelete(false)}
                                onCancel={() => this.setStatusModalDelete(false)}
                                centered
                            >
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
