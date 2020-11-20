import { notification } from 'antd';
import React from 'react';

export const openNotification = (type, message, description) => {
  notification.config({
    duration: 6,
    placement: 'topRight',
  });
  const lines = description.split('\n');
  const descriptionElement = (
    <code key='notification'>
      {lines.map(l => <span>{l}<br/></span>)}
    </code>
  )
  notification[type]({
    message: message,
    description: descriptionElement,
  });
};
