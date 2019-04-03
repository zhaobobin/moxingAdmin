/**
 * 高德地图
 */
import React from 'react';
import { Map, Marker } from 'react-amap';
import Geolocation from 'react-amap-plugin-geolocation';

const amapkey = '9d09d48f8025795e91ec489ac2c42968';

export default class GaodeMap extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      plugins: ['ToolBar'],
      position: {}
    };
  }

  //初始化默认地址
  initAddress = () => {
    const { defaultAddress } = this.props;
    if(defaultAddress){
      let _this = this,
        geocoder = new window.AMap.Geocoder();
      geocoder.getLocation(defaultAddress, function(status, result) {
        if (result && result.info === 'OK') {
          let location = result.geocodes[0].location;
          let position = {longitude: location.lng, latitude: location.lat};
          _this.setState({
            position
          })
        }
      });
    }
  };

  //地图点击事件
  mapClick = (o) => {
    let _this = this,
      position = {longitude: o.lnglat.lng, latitude: o.lnglat.lat};
    this.setState({
      position
    });
    let geocoder = new window.AMap.Geocoder(),
      lnglat = [position.longitude, position.latitude];
    geocoder.getAddress(lnglat, function(status, result) {
      if (result && result.info === 'OK') {
        _this.props.callback({
          place: result.regeocode.formattedAddress,
          position: {lng: o.lnglat.lng, lat: o.lnglat.lat}
        });
      }
    });
  };

  render(){

    const { plugins, position } = this.state;
    const { defaultAddress } = this.props;

    //加载优化
    const Loading = (
      <div
        style={{
          position: 'relative',
          height: '100%',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        Loading Map...
      </div>
    );

    //地图事件
    const mapEvents = {
      created: this.initAddress,
      click: this.mapClick
    };

    //自动定位
    const GeolocationPluginProps = {
      enableHighAccuracy: true,
      timeout: 10000,
      showButton: true,
      events: {
        created: o => {
          // 获取用户当前的精确位置信息
          o.getCurrentPosition((status, result) => {
            if (result && result.position) {
              this.props.callback({
                place: result.formattedAddress,
                position: {lng: result.position.lng, lat: result.position.lat}
              });   //依据浏览器定位取得当前默认地址
            }
          })
        },
      }
    };

    return(
      <Map
        loading={Loading}
        amapkey={amapkey}
        events={mapEvents}
        version={'1.4.2&plugin=AMap.Geocoder'}
        plugins={plugins}
        center={position}
        zoom={15}
      >
        <Marker position={position}/>
        {
          defaultAddress ?
            null
            :
            <Geolocation {...GeolocationPluginProps} />
        }
      </Map>
    )
  }

}
