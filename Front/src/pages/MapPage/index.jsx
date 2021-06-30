import { PageContainer } from '@ant-design/pro-layout';
import {
    AMapScene,
    LayerEvent,
    LineLayer,
    MapboxScene,
    PolygonLayer,
    Popup,
    Marker,
  } from '@antv/l7-react';
import { Card, Input } from 'antd';
import * as React from 'react';
import {useState, useRef, useEffect} from 'react';
import { useIntl, connect, FormattedMessage } from 'umi';
import styles from '../Welcome.less'


const World = (props) =>{
        const {dispatch,Mapinfo} = props
        const { Search } = Input;

        const [popupInfo, setPopInfo] = React.useState();
        const hoverHandle = (e) => {
            console.log(e);
            setPopInfo(e);
        };
        const hoverOutHandle = () => {
            setPopInfo(undefined);
        };
        
        const cor =[[111.9287109375, 28.22697003891834],
        [115.6640625, 28.22697003891834],
        [115.6640625, 31.015278981711266],
        [111.9287109375, 31.015278981711266],]

        const cor_lis =  Mapinfo.mapInfo
        const alert_lis = Mapinfo.alert_info
        console.log("in world:", Mapinfo.alert_info)

        const handleSearch = (v,e) => {
            console.log("正在搜索", v)
            dispatch({
              type: 'map/map',
              payload: {
                deviceID:v
              },
            });
          }

        function creatMarkers() {
            const markers = [];
            if(cor_lis){
                for (let i = 0; i < cor_lis.length; i++) {
                    
                    if(alert_lis[i] == 0){
                        console.log("RED");
                        markers.push(<Marker key={i} lnglat={cor_lis[i]} option={{color:"LimeGreen"}}/>);
                    }else{
                        markers.push(<Marker key={i} lnglat={cor_lis[i]} option={{color:"pink"}} />);
                    }
                }
                return markers;
            }
            
        }
    
        const data = {
            type: 'FeatureCollection',
            features: [
            {
                type: 'Feature',
                properties: {},
                geometry: {
                type: 'Polygon',
                coordinates: [cor_lis
                ],
                },
            },
            ],
        };

        const extraContent = (
            <div className={styles.extraContent}>
              <Search className={styles.extraContentSearch} placeholder="Defalut:device0001" onSearch={handleSearch} />
            </div>
          );

        useEffect(() => {
            if (dispatch) {
              console.log("First fetch in Map")
              dispatch({
                type: 'map/map',
              });
            }
          }, []);

        return (
            <React.Fragment>
                <Card
        className={styles.listCard}
        bordered={false}
        title="历史轨迹查询"
        style={{
          marginTop: 24,
        }}
        bodyStyle={{
          padding: '0 0 0 0',
        }}
        extra={extraContent}></Card>
                <Card style={{ height:600}}>
            <AMapScene
            map={{
                center: [120.2287109375, 30.22697003891834],
                pitch: 0,
                style: 'light',
                zoom: 10,
            }}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
            }}
            >
            {data && [
                // <PolygonLayer
                //   key={'2'}
                //   options={{
                //     autoFit: false,
                //   }}
                //   source={{
                //     data,
                //   }}
                //   color={{
                //     values: '#2E8AE6',
                //   }}
                //   shape={{
                //     values: 'fill',
                //   }}
                //   style={{
                //     opacity: 0.5,
                //   }}
                // >
                //   <LayerEvent type="mousemove" handler={hoverHandle} />
                //   <LayerEvent type="mouseout" handler={hoverOutHandle} />
                // </PolygonLayer>,
                <LineLayer
                key={'21'}
                source={{
                    data,
                }}
                color={{
                    values: '#2E8AE6',
                }}
                shape={{
                    values: 'line',
                }}
                style={{
                    opacity: 1,
                }}
                />,
            ]}
            {creatMarkers()}
            {popupInfo && (
                <Popup
                key="popup"
                // @ts-ignore
                lnglat={popupInfo.lngLat}
                option={{ closeButton: false, offsets: [0, 10] }}
                >
                <span>这是个信息框</span>
                </Popup>
            )}
            </AMapScene>
            </Card>
            </React.Fragment>
        );

}

// ReactDOM.render(<World />, document.getElementById('map'));



export default connect(({ map, loading }) => ({
    Mapinfo: map,
    loading: loading.models.map,
  }))(World);
