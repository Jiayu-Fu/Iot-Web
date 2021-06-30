import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { useIntl, connect, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import ProDescriptions from '@ant-design/pro-descriptions';
import UpdateForm from './components/UpdateForm';
import { queryRule, updateRule, addRule, removeRule } from './service';
/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */

const handleAdd = async (fields) => {
  const hide = message.loading('Adding');

  try {
    await addRule({ ...fields });
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};
/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */

const handleUpdate = async (fields) => {
  const hide = message.loading('Configuring');

  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();
    message.success('Configuration is successful');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};
/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */

const handleRemove = async (selectedRows) => {
  const hide = message.loading('Deleting');
  if (!selectedRows) return true;

  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};

const TableList = (props) => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalVisible, handleModalVisible] = useState(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */

  console.log('table props', props)

  const {dispatch,Tableinfo} = props
  // const {tableInfo} = Tableinfo
  // console.log("out my func", tableInfo)

  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const actionRef = useRef();
  const [currentRow, setCurrentRow] = useState();
  const [selectedRowsState, setSelectedRows] = useState([]);
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  const intl = useIntl();
  const columns = [
    {
      title: (
        <FormattedMessage
          // id="pages.searchTable.updateForm.ruleName.nameLabel"
          id="设备ID"
          defaultMessage="设备ID"
        />
      ),
      dataIndex: 'deviceID',
      tip: 'The rule name is the unique key',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      // title: <FormattedMessage id="pages.searchTable.titleDesc" defaultMessage="Description" />,
      title: <FormattedMessage id="设备名称" defaultMessage="设备名称" />,
      dataIndex: 'deviceName',
      valueType: 'textarea',
    },
    {
      // title: <FormattedMessage id="pages.searchTable.titleDesc" defaultMessage="Description" />,
      title: <FormattedMessage id="描述" defaultMessage="描述" />,
      dataIndex: 'information',
      valueType: 'textarea',
    },
    {
      title: (
        <FormattedMessage
          // id="pages.searchTable.titleCallNo"
          // defaultMessage="Number of service calls"
          id="数值"
          defaultMessage="数值"
        />
      ),
      dataIndex: 'value',
      sorter: true,
      hideInForm: true,
      renderText: (val) =>
        `${val}${intl.formatMessage({
          id: 'pages.searchTable.tenThousand',
          defaultMessage: ' 万 ',
        })}`,
    },
    {
      // title: <FormattedMessage id="pages.searchTable.titleStatus" defaultMessage="Status" />,
      title: <FormattedMessage id="设备状态" defaultMessage="设备状态" />,
      dataIndex: 'alert',
      hideInForm: true,
      valueEnum: {
        2: {
          text: (
            <FormattedMessage
              id="正常"
              defaultMessage="正常"
            />
          ),
          status: 'Default',
        },
        3: {
          text: (
            <FormattedMessage id="告警" defaultMessage="告警" />
          ),
          status: 'Processing',
        },
        0: {
          text: (
            <FormattedMessage id="正常" defaultMessage="正常💃" />
          ),
          status: 'Success',
        },
        1: {
          text: (
            <FormattedMessage
              id="告警"
              defaultMessage="告警🙅"
            />
          ),
          status: 'Error',
        },
      },
    },
    {
      title: (
        <FormattedMessage
          // id="pages.searchTable.titleUpdatedAt"
          // defaultMessage="Last scheduled time"
          id="时间戳"
          defaultMessage="时间戳"
        />
      ),
      sorter: true,
      dataIndex: 'timestamp',
      valueType: 'dateTime',
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');

        if (`${status}` === '0') {
          return false;
        }

        if (`${status}` === '3') {
          return (
            <Input
              {...rest}
              placeholder={intl.formatMessage({
                id: 'pages.searchTable.exception',
                defaultMessage: 'Please enter the reason for the exception!',
              })}
            />
          );
        }

        return defaultRender(item);
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          <FormattedMessage id="pages.searchTable.config" defaultMessage="Configuration" />
        </a>,
        <a key="subscribeAlert" href="https://procomponents.ant.design/">
          <FormattedMessage
            id="pages.searchTable.subscribeAlert"
            defaultMessage="Subscribe to alerts"
          />
        </a>,
      ],
    },
  ];

  const TableQuery = (params) =>{
    const { dispatch,Tableinfo, loading } = props;
    dispatch({
      type: 'table/table',
      payload:{ ...params, sorter, filter },
    });
    
    const{tableInfo} = Tableinfo
    const {current, pageSize, filter, sorter} = params
    console.log("params", params)
    console.log("cur&page:", current, pageSize, tableInfo)
    let dataSource = [...tableInfo]
    console.log("dataSource", dataSource, sorter)

    if (sorter) {
      dataSource = dataSource.sort((prev, next) => {
        let sortNumber = 0;
        Object.keys(sorter).forEach((key) => {
          if (sorter[key] === 'descend') {
            if (prev[key] - next[key] > 0) {
              sortNumber += -1;
            } else {
              sortNumber += 1;
            }

            return;
          }
          if (prev[key] - next[key] > 0) {
            sortNumber += 1;
          } else {
            sortNumber += -1;
          }
        });
        return sortNumber;
      });
    }

    console.log("before filter",filter)
    if (filter) {
      // console.log("filter",filter)
      // const a_filter = JSON.parse(filter);
      // console.log("after filter",filter)

      if (Object.keys(filter).length > 0) {
        dataSource = dataSource.filter((item) => {
          return Object.keys(filter).some((key) => {
            if (!filter[key]) {
              return true;
            }

            if (filter[key].includes(`${item[key]}`)) {
              return true;
            }

            return false;
          });
        });
      }
    }

    console.log("name test:", params.name)
    if (params.deviceID) {
      dataSource = dataSource.filter((data) => data.deviceID.includes(params.deviceID || ''));
    }

    // if (params.value) {
    //   dataSource = dataSource.filter((data) => data.value.includes(params.value || ''));
    // }

    // if (params.alert) {
    //   dataSource = dataSource.filter((data) => data.alert.includes(params.alert || ''));
    // }

    
    const result = {
      data: dataSource,
      total: tableInfo.length,
      success: true,
      pageSize,
      current: parseInt(`${params.currentPage}`, 10) || 1,
    };
    console.log(" FINAL:", result)
    // Promise.resolve()
    return result;
  }

  useEffect(() => {
    if (dispatch) {
      console.log("ami first?")
      dispatch({
        type: 'table/table',
      });
    }
  }, []);

  return (
    <PageContainer>
      <ProTable
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        // mock时使用
        // request={(params, sorter, filter) => queryRule({ ...params, sorter, filter })}
        // no-mock使用
        request={(params, sorter, filter) => TableQuery({ ...params, sorter, filter })}
        columns={columns}

      />
      
      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);

          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setCurrentRow(undefined);
        }}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
      />
    </PageContainer>
  );
};

// export default TableList;

export default connect(({ table, loading }) => ({
  Tableinfo: table,
  // submitting: loading.effects['table/table'],
  loading: loading.models.table,
}))(TableList);