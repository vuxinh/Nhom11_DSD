import React from 'react';
import 'antd/dist/antd.css';
import {Table, Checkbox, Col, Row, Input, Select, Button, Modal} from 'antd';
import {SearchOutlined, DeleteOutlined, FolderAddOutlined} from '@ant-design/icons';
import {withRouter} from 'react-router'

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
        };
        this.onChange = this.onChange.bind(this);
        this.editArea = this.editArea.bind(this);
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
            pathname: '/area-manage/detail',
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
