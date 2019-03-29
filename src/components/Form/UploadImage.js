import React from 'react';
import { connect } from 'dva';
import { Upload, Icon, Input, notification } from 'antd'
import { file2base64 } from "@/utils/utils";
import styles from './UploadImage.less'
//const base64 = require('base-64');      //let image = base64.encode(data.base64);

@connect(({ global }) => ({
  global,
}))
export default class UploadImage extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      loading: false,
      imageUrl: '',
    }
  }

  beforeUpload = (file) => {
    const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
    if (!isJPG) {
      notification.error({message: '只能上传jpg、png文件!'});
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      notification.error({message: '文件大小不能超过2MB!'});
    }
    return isJPG && isLt2M;
  };

  handleUpload = ({file}) => {

    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    this.setState({loading: true});

    //this.uploadImage(file);

    let _this = this;
    file2base64(file, function(data){
      let imageList = [];
      imageList.push(data.base64);
      _this.uploadImage(imageList);
    });
  };

  uploadImage = (imageList) => {
    //console.log(imageList)
    this.props.dispatch({
      type: 'global/post',
      url: '/api/expert/upload',
      payload: {
        type: '4',
        image: JSON.stringify(imageList),
      },
      callback: (res) => {
        setTimeout(() => { this.ajaxFlag = true }, 500);
        if(res.code === '0'){
          this.setState({
            loading: false,
            imageUrl: res.data[0].img_url
          });
          this.props.callback(res.data[0]);                   //将url传给父组件
        }else{
          this.setState({loading: false});
          notification.error({
            message: '上传错误！',
            description: res.msg
          });
        }
      }
    });
  };

  render(){

    const { loading, imageUrl } = this.state;
    const { type } = this.props;
    let currentUrl = this.props.defaultUrl;

    if(imageUrl) currentUrl = imageUrl;

    const uploadButton = currentUrl && !loading ?
      <div>
        <img src={currentUrl} width="100%" height="auto" alt="imgUrl"/>
      </div>
      :
      type === 'card' ?
        <div style={{height: '100%'}}>
          <Icon type={loading ? 'loading' : 'plus'} />
        </div>
        :
        <div style={{padding: '50px'}}>
          <p className="ant-upload-drag-icon">
            <Icon type={loading ? 'loading' : 'inbox'} />
          </p>
          <p className="ant-upload-text">选择图片进行上传</p>
          <p className="ant-upload-hint">只能上传单张不超过2mb的jpg、png图片</p>
        </div>;

    return(
      <div className={`${styles.uploadImg} ${styles.card}`}>
        <Upload
          listType={type === 'card' ? 'picture-card' : null}
          name="image"
          accept=".jpeg,.png"
          showUploadList={false}
          beforeUpload={this.beforeUpload}
          customRequest={this.handleUpload}
        >
          {uploadButton}
        </Upload>
      </div>
    )
  }

}
