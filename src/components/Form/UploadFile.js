import React from 'react';
import { connect } from 'dva';
import { Upload, Button, Icon, notification } from 'antd'

@connect(({ global }) => ({
  global,
}))
export default class UploadFile extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      action: '/api/version/version_add',
      defaultFileList: [],
    };
  }

  onChange = ({ file, fileList }) => {
    if (file.status !== 'uploading') {
      console.log(file, fileList);
    }
  };

  render(){

    const { accept } = this.props;
    const { action, defaultFileList } = this.state;

    return(
      <Upload accept={accept} action={action} defaultFileList={defaultFileList}>
        <Button>
          <Icon type="upload" /> 上传
        </Button>
      </Upload>
    )
  }

}
