import React, { useRef, useState, useEffect } from 'react';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Input,
  List,
  Modal,
} from 'antd';
import { findDOMNode } from 'react-dom';
import { PageContainer } from '@ant-design/pro-layout';
import { connect } from 'umi';
import moment from 'moment';
import OperationModal from './components/OperationModal';
import styles from './style.less';

const { Search } = Input;

// 后3列信息
// const ListContent = ({ data: {name, owner, createdAt, } }) => (
//   <div className={styles.listContent}>
//     <div className={styles.listContentItem}>
//       <span>NAME</span>
//       <p>我的名字</p>
//     </div>
//     <div className={styles.listContentItem}>
//       <span>Owner</span>
//       <p>{owner}</p>
//     </div>
//     <div className={styles.listContentItem}>
//       <span>开始时间</span>
//       <p>{moment(createdAt).format('YYYY-MM-DD HH:mm')}</p>
//     </div>
//   </div>
// );

//no-mock 格式
const ListContent = ({ data: {deviceName, timestamp, } }) => (
    <div className={styles.listContent}>
      <div className={styles.listContentItem}>
        <span>拥有者</span>
        <p>鲸鱼</p>
      </div>
      <div className={styles.listContentItem}>
        <span>设备名称</span>
        <p>{deviceName}</p>
      </div>
      <div className={styles.listContentItem}>
        <span>创建时间</span>
        <p>{moment(timestamp).format('YYYY-MM-DD HH:mm')}</p>
      </div>
    </div>
  );


export const BasicList = (props) => {
  const addBtn = useRef(null);
  const {
    loading,
    dispatch,
    deviceList: { list },
  } = props;

  console.log("BasicList props", props)
  console.log("Needed LIST!", list)

  const [done, setDone] = useState(false);
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(undefined);

  useEffect(() => {
    dispatch({
      type: 'deviceList/deviceList',
    //   payload: {
    //     count: 5,
    //   },
    });
  }, []);

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    pageSize: 20,
    total: 1,
  };

  const showModal = () => {
    setVisible(true);
    setCurrent(undefined);
  };

  const showEditModal = (item) => {
    setVisible(true);
    setCurrent(item);
  };

  // 搜索框
  // TODO 定义搜索行为
  const handleSearch = (v,e) => {
    console.log("正在搜索", v)
    dispatch({
      type: 'deviceList/searchAndUpdate',
      payload: {
        deviceID:v
      },
    });
  }
  const showval = () =>{
    // console.log()
  }
  const extraContent = (
    <div className={styles.extraContent}>
      <Search className={styles.extraContentSearch} placeholder="e.g:device0001" onSearch={handleSearch} />
    </div>
  );

  const setAddBtnblur = () => {
    if (addBtn.current) {
      // eslint-disable-next-line react/no-find-dom-node
      const addBtnDom = findDOMNode(addBtn.current);
      setTimeout(() => addBtnDom.blur(), 0);
    }
  };

  const handleDone = () => {
    setAddBtnblur();
    setDone(false);
    setVisible(false);
  };

  const handleCancel = () => {
    setAddBtnblur();
    setVisible(false);
  };

  const handleSubmit = (values) => {
    setAddBtnblur();
    setDone(true);
    dispatch({
      type: 'deviceList/submit',
      payload: { ...values },
    });
  };

  return (
    <div>
      <PageContainer>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title="基本列表"
            style={{
              marginTop: 24,
            }}
            bodyStyle={{
              padding: '0 32px 40px 32px',
            }}
            extra={extraContent}
          >
            <Button
              type="dashed"
              style={{
                width: '100%',
                marginBottom: 8,
              }}
              onClick={showModal}
              ref={addBtn}
            >
              <PlusOutlined />
              添加
            </Button>

            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <a
                      key="edit"
                      onClick={(e) => {
                        e.preventDefault();
                        showEditModal(item);
                      }}
                    >
                      编辑
                    </a>,
                  ]}
                >
                  <List.Item.Meta
                    // avatar={<Avatar src={item.logo} shape="square" size="large" />}
                    // //mock
                    // title={<a href={item.href}>{item.title}</a>}
                    // description={item.subDescription}
                    //no-mock
                    title={<a>{item.deviceID}</a>}
                    description={item.information}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
      </PageContainer>

      <OperationModal
        done={done}
        current={current}
        visible={visible}
        onDone={handleDone}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default connect(({ deviceList, loading }) => ({
    deviceList,
    loading: loading.models.deviceList,
}))(BasicList);
