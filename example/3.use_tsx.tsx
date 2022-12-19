import moment, { Moment as What } from 'moment';
import type { Moment } from 'moment';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const mo = require('moment');

const b = moment();
b.seconds();

// -------------------
// Moment.js
moment().seconds();
// => 49
moment().hours();
// => 19

// Native
new Date().getSeconds();
// => 49
new Date().getHours();
// => 19

// dayjs
dayjs().second();
// => 49
dayjs().hour();
// => 19

// ------------------------------

moment().weekday(-7); // 上个星期一
moment().weekday(); // 上个星期一
// ------------------------------


console.log(moment() as Moment);
console.log(moment() as What);

const a: Moment = moment('123');
console.log(b.unix());

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
