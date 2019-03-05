import React, { Fragment } from 'react';
import Link from 'umi/link';
import { Icon } from 'antd';

import SelectLang from '@/components/SelectLang';
import styles from './UserLayout.less';
import logo from '@/assets/logo.png';
import {ENV} from '@/utils/utils'

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> {ENV.company}
  </Fragment>
);

class UserLayout extends React.PureComponent {

  render() {
    const { children } = this.props;
    return (

      <div className={styles.container}>

        <div className={styles.lang}>
          <SelectLang />
        </div>

        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>{ENV.appname}</span>
              </Link>
            </div>
          </div>
          {children}
        </div>

      </div>

    );
  }
}

export default UserLayout;
