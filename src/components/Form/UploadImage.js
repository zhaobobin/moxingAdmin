import React from 'react';
import { connect } from 'dva';
import { Upload, Icon, Input, notification } from 'antd'
import { file2base64, dataURLtoBlob, base64to2 } from "@/utils/utils";
import styles from './UploadImage.less'

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

    let _this = this;
    file2base64(file, function(data){
      _this.uploadImage(data.base64);
    });
  };

  uploadImage = (image) => {

    this.props.dispatch({
      type: 'global/post',
      url: '/api/expert/upload',
      payload: {
        type: '4',
        image: image,
      },
      callback: (res) => {
        setTimeout(() => { this.ajaxFlag = true }, 500);
        this.setState({loading: false});
        if(res.code === '0'){
          this.props.callback(res.data);                   //将url传给父组件
        }else{
          notification.error({
            message: '上传错误！',
            description: res.msg
          });
        }
      }
    });
  };

  render(){

    const { loading } = this.state;

    const uploadButton = (
      <div>
        <p className="ant-upload-drag-icon">
          <Icon type={loading ? 'loading' : 'inbox'} />
        </p>
        <p className="ant-upload-text">选择图片进行上传</p>
        <p className="ant-upload-hint">只能上传单张不超过2mb的jpg、png图片</p>
      </div>
    );

    return(
      <div className={styles.uploadImg}>
        <Upload
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
