import React,{useState, useRef, useEffect} from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Typography,Row ,Col, Input} from 'antd';
import { useIntl, connect,FormattedMessage } from 'umi';
import styles from './Welcome.less';
import { StatisticCard } from '@ant-design/pro-card';
import RcResizeObserver from 'rc-resize-observer';
import DemoLine from '@/components/Charts/LineChart';

const CodePreview = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

const welcomePage =  (props) => {
  const { Search } = Input;
  const { Statistic, Divider } = StatisticCard;
  const {dispatch, welcomeInfo} = props
  const div = welcomeInfo.o_num + welcomeInfo.t_num
  console.log("props:wel",welcomeInfo)
  const intl = useIntl();
  const [responsive, setResponsive] = useState(false);
  const [chartID, setChartID] = useState(undefined);

  const handleSearch = (v,e) => {
    // console.log("welcome before", v)
    // setChartID({"deviceID":v})
    // console.log("welcome", chartID)
    console.log("正在welcome", v)
    dispatch({
      type: 'welcome/lineChart',
      payload: {
        deviceID:v
      },
    });
  }

  const extraContent = (
    <div className={styles.extraContent}>
      <Search className={styles.extraContentSearch} placeholder="Default:device0001" onSearch={handleSearch} />
    </div>
  );

  const imgStyle = {
    display: 'block',
    width: 42,
    height: 42,
  };

  useEffect(() => {
    if (dispatch) {
      console.log("First fetch in useEffect")
      dispatch({
        type: 'welcome/welcome',
      });
    }
  }, []);
  
  return (
    <PageContainer>
      <Row>
      <Col span={24}>
      <Card>
          <RcResizeObserver
            key="resize-observer"
            onResize={(offset) => {
              setResponsive(offset.width < 596);
            }}
          >
          <StatisticCard.Group direction={responsive ? 'column' : 'row'}>
            <StatisticCard
              statistic={{
                title: '设备注册量',
                value: welcomeInfo.t_num,
                icon: (
                  <img
                    style={imgStyle}
                    src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*dr_0RKvVzVwAAAAAAAAAAABkARQnAQ"
                    alt="icon"
                  />
                ),
              }}
            />
            <StatisticCard
              statistic={{
                title: '在线设备量',
                value: welcomeInfo.o_num,
                icon: (
                  <img
                    style={imgStyle}
                    src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*FPlYQoTNlBEAAAAAAAAAAABkARQnAQ"
                    alt="icon"
                  />
                ),
              }}
            />
            <StatisticCard
              statistic={{
                title: '接受数据量',
                value: welcomeInfo.d_num,
                icon: (
                  <img
                    style={imgStyle}
                    src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*pUkAQpefcx8AAAAAAAAAAABkARQnAQ"
                    alt="icon"
                  />
                ),
              }}
            />
          </StatisticCard.Group>
        </RcResizeObserver>
      </Card>
      </Col>
      </Row>
      <Row>
      <Col span={24}>
      <Card
        className={styles.listCard}
        bordered={false}
        title="设备信息：Value总览"
        style={{
          marginTop: 24,
        }}
        bodyStyle={{
          padding: '40px 32px 40px 32px',
        }}
        extra={extraContent}>
        <DemoLine device_id = {chartID}></DemoLine>
      </Card>
      </Col>
      </Row>
    </PageContainer>
  );
};

export default connect(({ welcome, loading }) => ({
  welcomeInfo: welcome,
  submitting: loading.effects['welcome/welcome'],
}))(welcomePage);
