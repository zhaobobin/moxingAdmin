import React from 'react';
import { Tabs } from 'antd'

import UploadFile from '@/components/Form/UploadFile'

const TabPane = Tabs.TabPane;

export default class AppManage extends React.Component {

  render(){

    return(
      <div>
        <Tabs defaultActiveKey="1" animated={false}>
          <TabPane tab="Android" key="1">
            <UploadFile accept=".apk"/>
          </TabPane>
          <TabPane tab="iOS" key="2">
            <UploadFile accept=".deb,.ipa,.pxl"/>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
