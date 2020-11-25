import React from 'react';
import {withRouter} from 'react-router-dom';
import 'antd/dist/antd.css';
import {Input, Select, Tabs, Button, Checkbox, Table, Modal} from 'antd';
import {DeleteOutlined, FolderAddOutlined} from "@ant-design/icons";

const {TabPane} = Tabs

function callback(key) {
    console.log(key);
}

class DetailArea extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            oldarea: {
                ...this.props.location.state.area,
                longitude: 1000,
                latitude: 300,
                maxH: 100,
                minH: 5,
            },
            newdarea: {
                ...this.props.location.state.area,
                longitude: 1000,
                latitude: 300,
                maxH: 100,
                minH: 5,
            },
            columnsDomain: [
                {
                    title: '',
                    key: 'key',
                    render: (val) => (
                        <Checkbox data-key={val.key} onChange={this.onChange}/>
                    ),
                },
                {
                    title: 'Tên miền giám sát',
                    dataIndex: 'name',
                    key: 'name',

                },
                {
                    title: 'Tên khu vực chứa miền',
                    dataIndex: 'area',
                    key: 'area',
                },
                {
                    title: 'Mã miền giám sát',
                    dataIndex: 'index',
                    key: 'index',
                },
                {
                    title: 'Kinh độ',
                    key: 'latitude',
                    dataIndex: 'latitude',
                },
                {
                    title: 'Vĩ độ',
                    key: 'longtitude',
                    dataIndex: 'longtitude',
                }
            ],
            listDomain: [
                {
                    name: 'Domain 1',
                    area: 'KV1',
                    index: 'MIEN1',
                    latitude: 60,
                    longtitude: 30
                },
                {
                    name: 'Domain 2',
                    area: 'KV2',
                    index: 'MIEN2',
                    latitude: 100,
                    longtitude: 40
                },
            ],
            openModalAdd: false,
            openModalDelete: false,
    
        }
        this._handleChange = this._handleChange.bind(this);
    }
    
    componentDidMount() {
        console.log(this.state.newarea);
        
    }
    
    diff(obj1, obj2) {
        let difference = Object.keys(obj1).filter(k => obj1[k] !== obj2[k]);
        return difference.length === 0;
    }
    
    _handleChange(e) {
        let key = e.target.name;
        let value = e.target.value;
        this.setState(prevState => {
            let newarea = Object.assign({}, prevState.newarea);
            newarea[key] = value;
            return { newarea };
        })
    }
    
    setStatusModalAdd(openModalAdd) {
        this.setState({openModalAdd});
    }
    
    setStatusModalDelete(openModalDelete) {
        this.setState({openModalDelete});
    }
    
    render() {
        return (
            <div className="main">
                <Tabs defaultActiveKey="1" onChange={callback}>
                    <TabPane tab="Thông tin khu vực giám sát" key="1">
                        <div className="content">
                            <table className="table table-hover table-responsive table-borderless">
                                <tr>
                                    <th style={{width: '50%'}}>Mã khu vực giám sát</th>
                                    <td>
                                        <Input name="key" style={{width: 200}} placeholder="Nhập"
                                               value={this.state.newarea.key}
                                               onChange={this._handleChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{width: '50%'}}>Tên khu vực giám sát</th>
                                    <td>
                                        <Input name="name" style={{width: 200}} placeholder="Nhập"
                                               value={this.state.newarea.name} onChange={this._handleChange}/>
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{width: '50%'}}>Kinh độ</th>
                                    <td>
                                        <Input name="longitude" style={{width: 200}} placeholder="Nhập"
                                               value={this.state.newarea.longitude} onChange={this._handleChange}/>
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{width: '50%'}}>Vĩ độ</th>
                                    <td>
                                        <Input name="latitude" style={{width: 200}} placeholder="Nhập"
                                               value={this.state.newarea.latitude} onChange={this._handleChange}/>
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{width: '50%'}}>Chiều cao tối đa</th>
                                    <td>
                                        <Input name="maxH" style={{width: 200}} placeholder="Nhập"
                                               value={this.state.newarea.maxH} onChange={this._handleChange}/>
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{width: '50%'}}>Chiều cao tối thiểu</th>
                                    <td>
                                        <Input name="minH" style={{width: 200}} placeholder="Nhập"
                                               value={this.state.newarea.minH} onChange={this._handleChange}/>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <br/>
                        <div className="action center">
                            <div className="save">
                                {
                                    !this.diff(this.state.oldarea, this.state.newarea) && <Button type="primary">Lưu</Button>
                                }
                                {
                                    (this.diff(this.state.oldarea, this.state.newarea)) && <Button disabled>Lưu</Button>
                                }
                            </div>
                            
                        </div>
                    </TabPane>
                    <TabPane tab="Danh sách miền trong khu vực" key="2">
                        <div className="filter">
                            <Button type="primary" danger icon={<DeleteOutlined/>} style={{marginRight: 10}}
                                    onClick={() => this.setStatusModalDelete(true)}>
                                Xóa
                            </Button>
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
                            <Table columns={this.state.columnsDomain} dataSource={this.state.listDomain} rowKey="key"/>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

export default withRouter(DetailArea);
