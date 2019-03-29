import React from 'react';
import { connect } from 'dva';
import { Upload, Icon, Input, notification } from 'antd'
import { file2base64 } from "@/utils/utils";
import styles from './UploadImageList.less'
//const base64 = require('base-64');      //let image = base64.encode(data.base64);

@connect(({ global }) => ({
  global,
}))
export default class UploadImageList extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      loading: false,
      photoList: this.props.photoList || [],
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
          const { photoList } = this.state;
          let list = [];
          for(let i in res.data){
            let img = {
              image: res.data[i].img_url,
              img_h: res.data[i].width,
              img_w: res.data[i].height,
            };
            list.push(img)
          }
          list = photoList.concat(list);
          this.setState({
            loading: false,
            photoList: list,
          });
          this.props.callback(list);                   // 返回图片列表
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

    const { loading, photoList } = this.state;

    const uploadButton = (
      <div style={{height: '100%'}}>
        <Icon type={loading ? 'loading' : 'plus'} />
      </div>
    );

    return(
      <div className={styles.uploadImg}>
        <ul className={styles.imgList}>
          {
            photoList.length > 0 ?
              photoList.map((item, index) => (
                <li key={index}>
                  <div className={styles.box}>
                    <div className={styles.box2}>
                      <img src={item.image} alt="image"/>
                    </div>
                  </div>
                </li>
              ))
              :
              null
          }
          {
            photoList.length < 9 ?
              <li>
                <div className={styles.box}>
                  <div className={styles.box2}>
                    <Upload
                      listType="picture-card"
                      name="image"
                      accept=".jpeg,.png"
                      // multiple={true}
                      showUploadList={false}
                      beforeUpload={this.beforeUpload}
                      customRequest={this.handleUpload}
                    >
                      {uploadButton}
                    </Upload>
                  </div>
                </div>
              </li>
              :
              null
          }
        </ul>
      </div>
    )
  }

}
