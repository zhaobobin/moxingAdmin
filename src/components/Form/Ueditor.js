import React from 'react';
import { connect } from 'dva';
import { ENV, Storage, hasErrors, file2base64 } from '@/utils/utils';

import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

@connect(state => ({
  global: state.global,
}))
export default class Ueditor extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      editorState: EditorState.createEmpty(),
    }
  }

  componentDidMount(){
    this.initContent();
  }

  initContent = () => {
    const { content } = this.props;
    if(!content) return;
    let html = content.replace('↵', '');
    html = '<div>' + html + '</div>';
    const blocksFromHtml = htmlToDraft(html);
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
    const editorState = EditorState.createWithContent(contentState);
    this.setState({
      editorState
    })
  };

  //监控富文本变化
  onEditorStateChange = (editorState) => {
    let content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    this.props.callback(content);
    this.setState({
      editorState
    });
  };

  editorImageUpload = (file) => {

    let _this = this;

    return new Promise(
      (resolve, reject) => {

        file2base64(file, function(data){
          let imageList = [];
          imageList.push(data.base64);
          _this.props.dispatch({
            type: 'global/post',
            url: '/api/expert/upload',
            payload: {
              type: '2',
              image: JSON.stringify(imageList),
            },
            callback: (res) => {
              if(res.code === '0'){
                resolve({data: {link: res.data[0].img_url}})
              }else{
                reject(res)
              }
            }
          });
        });

      }
    );
  };

  render(){

    const { height } = this.props
    const { editorState } = this.state;

    return(
      <div>
        <Editor
          editorState={editorState}
          toolbarClassName="home-toolbar"
          editorClassName="home-editor"
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
            fontFamily: { options: ['宋体', '黑体', '楷体', '微软雅黑','Arial',  'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana',]},
            image: {
              previewImage: true,
              alignmentEnabled: true,
              uploadCallback: this.editorImageUpload,
              inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
            }
          }}
          placeholder="请输入正文..."
          spellCheck
          localization={{ locale: 'zh' }}
        />
        <style>
          {
            `
              .home-toolbar{
                margin-bottom: 0;
                border: 1px solid #d9d9d9;
              }
              .home-toolbar a{
                color: #333;
              }
              .rdw-option-wrapper{
                min-width: 30px;
                height: 30px;
              }
              .public-DraftStyleDefault-block {
                margin: 0;
              }
              .home-editor{
                height: ${height}px;
                padding: 15px 20px;
                line-height: 20px;
                border: 1px solid #d9d9d9;
                border-top: none;
              }
              .home-editor img{
                max-width:100%;width:auto;height:auto;
              }
              .rdw-link-modal{
                height: auto
              }
            `
          }
        </style>
      </div>
    )
  }

}
