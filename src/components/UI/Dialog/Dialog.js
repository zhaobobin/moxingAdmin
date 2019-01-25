import React from 'react';
import { Modal } from 'antd';
import styles from './Dialog.less'

const modalWidth = '600px';

const modalOptions = {
  centered: true,
  destroyOnClose: true,
  autoFocusButton: null,
};

export function Alert(opt){
  Modal.info({
    ...modalOptions,
    width: opt.width || modalWidth,
    maskClosable: true,
    className: styles.alert,
    title: (
      <p className={styles.dialogTitle}>{opt.title}</p>
    ),
    okText: opt.btns || '确定',
    onOk() {
      return opt.callback(1)
    },
    onCancel() {
      return opt.callback(-1)
    },
  });
}

export function Confirm(opt){
  Modal.confirm({
    ...modalOptions,
    width: opt.width || modalWidth,
    maskClosable: false,
    className: styles.modalConfirm,
    title: (
      <p className={styles.dialogTitle}>{opt.title}</p>
    ),
    okText: opt.btns ? opt.btns[0] : '确定',
    cancelText: opt.btns ? opt.btns[1] : '取消',
    onOk() {
      return opt.callback(1)
    },
    onCancel() {
      return opt.callback(0);
    },
  });
}

export function ResultConfirm(opt){
  const modal = Modal.confirm({
    ...modalOptions,
    width: opt.width || modalWidth,
    maskClosable: false,
    className: styles.modalConfirm,
    title: '',
    content: (
      <div className={styles.dialogContent}>
        <img src={opt.img} alt="" />
        <p><strong>{opt.title}</strong></p>
        <p><span>{opt.msg}</span></p>
      </div>
    ),
    okText: opt.btns ? opt.btns[0] : '确定',
    cancelText: opt.btns ? opt.btns[1] : '取消',
    onOk() {
      return opt.callback(1)
    },
    onCancel(e) {
      if(e.triggerCancel){
        return opt.callback(-1)
      }else{
        modal.destroy();
        return opt.callback(0);
      }
    },
  });
}

export function ArticleAlert(opt){
  Modal.info({
    ...modalOptions,
    width: opt.width || modalWidth,
    maskClosable: false,
    className: styles.modalArticleAlert,
    title: (
      <h1 className={styles.ArticleTitle}>{opt.title}</h1>
    ),
    content: (
      <div className={styles.ArticleDetail} dangerouslySetInnerHTML={{__html: opt.msg}} />
    ),
    okText: opt.btns ? opt.btns[0] : '确定',
    onOk() {
      return opt.callback(1)
    },
    onCancel() {
      return opt.callback(-1)
    },
  });
}
