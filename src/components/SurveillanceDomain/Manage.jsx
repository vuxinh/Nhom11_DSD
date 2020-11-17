import React from 'react';
import 'antd/dist/antd.css';
import {Table, Checkbox, Col, Row, Input, Select, Button, Modal} from 'antd';
import {SearchOutlined, DeleteOutlined, FolderAddOutlined} from '@ant-design/icons';
import {withRouter} from 'react-router'

const {Option} = Select;

class Manage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
        };
        this.onChange = this.onChange.bind(this);
        this.editDomain = this.editDomain.bind(this);
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
                        <Col span={6}>
                            <Input style={{width: 250}} placeholder="Search" prefix={<SearchOutlined/>}/>
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
                                            <Input style={{width: 200}} placeholder="Nhập"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th style={{width: '50%'}}>Vĩ độ</th>
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
