import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Input, Row, Col, Lov, Select, Tabs, Table} from 'choerodon-ui';
import Store from './stores/Store';
import {Link} from 'react-router-dom'
import './less/role.css';

//


@observer
export default class CreateRole extends Component {

    componentWillMount() {
        Store.loadcreateTab()
        Store.loadSubMenusData()
       this.loadValue()
    }
    loadValue(){
        console.log(Store.getformData)
        if(Store.getformData){
            const data1 = Store.getformData
            this.setState({
                bianmavalue:data1[1],
                mingchengvalue:data1[2]
            })
        }
    }
    constructor(props) {
        super(props);
        this.state = {
            ExpandedRowsKeys: [],
            keys: [],
            bianmavalue :"",
            mingchengvalue:"",
            tijiaovalue:{}
        }

    }
    handleBianma(e){
        // let value = e.target.value;
        if(!(/^[a-zA-Z][a-zA-Z0-9_,-/]*$/.test(e.target.value))) {
            alert('请输入正确的编码');
        }
    // ^[a-zA-Z][a-zA-Z0-9_-/]*$
        this.setState({
            bianmavalue:e.target.value
        })

    }
    handlemingcheng(e){
        console.log(e.target.value)
        if(!(/^[a-zA-Z][a-zA-Z0-9_,-/]*$/.test(e.target.value))) {
            alert('请输入正确的名称');
        }
        this.setState({
            mingchengvalue:e.target.value
        })

    }
    handleUpTree = () => {
        this.setState({
            keys: []
        })
    }


    handleOnExpand = (expanded, record) => {

        const {keys} = this.state;
        if (expanded==true) {
            keys.push(record.key);
        } else {
            for (let i = 0; i < keys.length; i++) {
                if (keys[i] === record.key) {
                    if (i) {
                        keys.splice(i, 1)
                    } else {
                        keys.splice(0, 1)
                    }
                }
                if (record.children) {
                    for (let y = 0; y < record.children.length; y++) {
                        if (keys[i] === record.children[y].id) {
                            delete keys[i];
                        }
                    }
                }
            }
        }
        Store.setExpandedRowsKeys(keys)

    }

    callback(key) {
        console.log(key);

    }

    handletijiao(){
        const tijiao = this.state.tijiaovalue
        const bianma = this.state.bianmavalue
        const mingcheng = this.state.mingchengvalue
        Store.setformData(tijiao)
        Store.setformData(bianma)
        Store.setformData(mingcheng)
      console.log(tijiao,bianma,mingcheng)
    }
    handletable() {
        console.log(Store.getformData)

        Store.setzhankaitable(!Store.getzhankaitable)
        if(Store.getzhankaitable){
            Store.setExpandedRowsKeys(Store.getcreateTab.map(item => item.key))
        }else{
            Store.setExpandedRowsKeys([])
        }
    }

    render() {
        const TabPane = Tabs.TabPane;
        const columns = [{
            title: '菜单',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
            render: (text, record) => {
                return <span><i className={`icon icon-${record.icon}`}></i>{record.name}</span>
            }
        }, {
            title: '页面入口',
            dataIndex: 'route',
            key: 'route',
            width: '32%'

        },
            {
                title: '',
                key: 'action',
                align: 'right',
                render: (text, record) => {
                    return <button className={"c7n-btn c7n-btn-circle c7n-btn-sm c7n-btn-icon-only c7n-btn-flat"}>
                        <i className={"icon icon-predefine"}></i>
                    </button>;
                },
            }
        ];
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);

            },
            onSelect: (record, selected, selectedRows) => {
                console.log(record, selected, selectedRows);
                this.setState({
                    tijiaovalue:selectedRows
                })
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                console.log(selected, selectedRows, changeRows);
            },
        };
        return (
            <div className={"App"}>
                <div className={"page-container c7n-roleMsg choerodon-role"}>
                    <div className={"page-head"}>
                        <div>
                            <Link to="/demo/role">
                                <button
                                    type={"button"}
                                    className={"c7n-btn back-btn small-tooltip c7n-btn-primary c7n-btn-circle c7n-btn-lg c7n-btn-icon-only c7n-btn-flat "}
                                >
                                    <i className={"icon icon-arrow_back"}
                                    >
                                    </i>
                                </button>
                            </Link>
                            <span className={"page-head-title createRoleBefore"}>创建{Store.getcreatetitle}角色</span>
                        </div>
                    </div>
                    <div className={"page-content"}>
                        <Row gutter={8}>
                            <Col span={7}>
                                <Input value={this.state.bianmavalue} placeholder="角色编码*" required label="Basic" onChange={this.handleBianma.bind(this)} copy/>
                            </Col>
                            <Col span={7}>
                                <Input value={this.state.mingchengvalue} placeholder="角色名称*" required label="Basic" onChange={this.handlemingcheng.bind(this)} copy/>
                            </Col>
                        </Row>
                        <div className={"createmenu"}>
                            <span className={"menumenu"}>菜单分配</span>
                            <button type={"button"} className={"c7n-btn c7n-btn-primary c7n-btn-flat"}
                                    onClick={this.handletable.bind(this)}>
                                {Store.zhankaitable == true ?
                                    <i className={"icon icon-expand_less"}>
                                        <span className={"font"}>全部收起</span>
                                    </i> :
                                    <i className={"icon icon-expand_more"}>
                                        <span className={"font"}>全部展开</span>
                                    </i>
                                }
                            </button>
                        </div>
                        <Tabs defaultActiveKey="1" onChange={this.callback}>

                        <TabPane tab={Store.getcreatetitle} key="1">
                        <Table expandedRowKeys={Store.getExpandedRowsKeys} onExpand={this.handleOnExpand}
                            // Store.getcreateTab.map(item => item.key)
                               rowSelection={rowSelection} columns={columns} dataSource={Store.getcreateTab}/>
                        </TabPane>
                        {
                            Store.getcreatetitle == "全局层" ?
                                <TabPane tab="个人中心" key="2">
                                    <Table expandedRowKeys={Store.getcreateSubMenusdata.map(item=>item.key)}  rowSelection={rowSelection} columns={columns} dataSource={Store.getcreateSubMenusdata}/>
                                </TabPane> : ''
                        }
                        </Tabs>
                        <div className={"createRolecreatediv"}>
                            <button type={"button"}className={"c7n-btn c7n-btn-primary c7n-btn-raised createRolecreatebtn"} onClick={this.handletijiao.bind(this)}>
                                <span>创建</span>
                                <div className={"c7n-ripple-wrapper"}></div>
                            </button>
                            <button type={"button"} className={"c7n-btn c7n-btn-raised"} style={{color: "rgb(63, 81, 181)"}}>
                                <span>取消</span>
                                <div className={"c7n-ripple-wrapper"}></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>


        );
    }
}