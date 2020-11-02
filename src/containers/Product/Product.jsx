import React, { Component } from 'react';
import { Form, Input, Select, Button, Card, Table, Tooltip, Space, Spin } from 'antd';
import { createFromIconfontCN, SearchOutlined } from '@ant-design/icons';

import './product.less'
import {  changeProductStatus, reqSearchProduct } from '../../api/index'

const PAGE_SIZE = 5;
const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2170307_j02yrol4sjl.js',
});



class Product extends Component {
  columns = [
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      width: "16vw",
      ellipsis: {
        showTitle: false,
      },
      render: name => <Tooltip placement="topLeft" title={name}><span>{name}</span></Tooltip>
    },
    {
      title: '商品描述',
      dataIndex: 'desc',
      key: 'desc',
      align: 'left',
      ellipsis: {
        showTitle: false,
      },
      render: desc => <Tooltip placement="topLeft" title={desc}><span>{desc}</span></Tooltip>
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      width: "5vw",
      ellipsis: {
        showTitle: false,
      },
      render: (price) => '￥' + price
    },
    {
      title: '状态',
      key: 'status',
      // dataIndex: 'status',
      align: 'center',
      width: "5vw",
      ellipsis: {
        showTitle: false,
      },
      render: (record) => (
        <div><Button type={record.status === 1 ? 'danger' : 'primary'} onClick={() => { this.changeStatus(record) }}>{record.status === 1 ? '下架' : '上架'}</Button></div>)
    },
    {
      title: '操作',
      key: 'operation',
      align: 'center',
      width: "5vw",
      ellipsis: {
        showTitle: false,
      },
      render: () =>
        <Space direction="vertical" >
          {/* <span>详情</span>
          <span>修改</span> */}
          <Button type="link">详情</Button>
          <Button type="link">修改</Button>
        </Space>
    },
  ];

  state = {
    showLoading: false,
    currentList: [],
    pages: 0,
    total: 0,
  }

  changeStatus = (record) => {
    changeProductStatus(record.name, record.status === 1 ? 2 : 1)   //请求更改商品上架，下架状态

    const duplicateList = [...this.state.currentList];      //同时更改redux的数据
    duplicateList.map((item) => {
      if (item === record) {
        item.status = record.status === 1 ? 2 : 1;
      }
      return item;
    });
    this.setState({
      currentList: duplicateList
    })
  }


  handleSearch = async (pageNum, pageSize) => {    //分页器搜索和form表单搜索统一
    this.setState({ showLoading: true })
    const { type, keyWord } = this.formRef.getFieldsValue();   // 统一通过ref获取form表单字段值，不用传入
    const { data: { pages, total, list }, status } = await reqSearchProduct({ pageNum, pageSize, type, keyWord });   //请求当前页面的商品信息
    status || this.setState({
      showLoading: false,
      currentList: list,
      pages,
      total,
    })
  }

  componentDidMount() {
    this.handleSearch(1, PAGE_SIZE);    //默认请求第一页的商品信息
  }

  render() {
    const { Option } = Select;

    return (<Card
      headStyle={{ border: "none", padding: 0 }}
      bodyStyle={{ padding: 0, }}
      bordered={false}

      title={<Form
        name="searchForm"
        layout="inline"
        wrapperCol={{ span: 7 }}
        ref={ref => this.formRef = ref}
        onFinish={() => { this.handleSearch(1, PAGE_SIZE) }}>
        <Form.Item name="type" noStyle initialValue="productName">
          <Select >
            <Option value="productName">名称</Option>
            <Option value="productDesc">描述</Option>
          </Select>
        </Form.Item>
        <Form.Item name="keyWord" noStyle>
          <Input style={{ width: '25%', margin: '0 10px' }} placeholder="请输入搜索关键字" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
            搜索
        </Button>
        </Form.Item>
      </Form>}

      extra={<Button type="primary" style={{
        borderRadius: 15
      }}><IconFont type="icon-titlebar_ic_add" />添加商品</Button>}
    >
      <Spin tip="Loading..." spinning={this.state.showLoading}>
        <Table
          size="large"
          align="center"
          rowKey="_id"
          rowClassName="productTable"
          columns={this.columns}
          dataSource={this.state.currentList}
          pagination={{ hideOnSinglePage: true, pageSize: PAGE_SIZE, total: this.state.total, onChange: (page, pageSize) => { this.handleSearch(page, pageSize) } }}
        />
      </Spin>,
    </Card>)
  }
}

export default Product;