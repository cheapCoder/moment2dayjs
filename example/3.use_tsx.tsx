import moment, { Moment as What } from 'moment';
import type { Moment } from 'moment';
import React, { useEffect, useState } from 'react';

const mo = require('moment');

console.log(moment() as Moment);
console.log(moment() as What);

const a: Moment = moment('123');
console.log(a.unix());

const [m, setMoment] = useState<Moment>(moment());

/*对antd的Select进行封装，使得Select选择框的宽度自动跟随下拉菜单的宽度*/
const AutoWidthSelect = function (props: { time: Moment }) {
  const [m, setMoment] = useState<Moment | null>(null);

  useEffect(() => {
    setMoment(moment() as Moment);
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

class Compone extends React.Component<{ m: Moment }> {}

export default AutoWidthSelect;
