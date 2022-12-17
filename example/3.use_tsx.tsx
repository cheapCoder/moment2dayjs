import moment, { Moment } from 'moment';
import React, { useEffect, useState } from 'react';

console.log(moment());

const a: Moment = moment();
console.log(a.unix());

/*对antd的Select进行封装，使得Select选择框的宽度自动跟随下拉菜单的宽度*/
const AutoWidthSelect = function () {
  const [m, setMoment] = useState<Moment | null>(null);

  useEffect(() => {
    setMoment(moment());
  }, []);

  return (
    <>
      <div>123123</div>
      <span>what</span>
      <h1>h11111</h1>

      {m?.date()}
    </>
  );
};

export default AutoWidthSelect;
