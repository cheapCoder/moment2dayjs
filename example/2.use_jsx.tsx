import { Select } from 'antd';
import { createPortal } from 'react-dom';
import { cloneElement, forwardRef, memo, useLayoutEffect, useRef, useState } from 'react';
import moment, {Moment} from 'moment';

console.log(moment());

const a: Moment = moment();
console.log(a.unix());

/*对antd的Select进行封装，使得Select选择框的宽度自动跟随下拉菜单的宽度*/
const AutoWidthSelect = memo(
  forwardRef(function AutoWidthSelect(props, ref) {
    const [style, setStyle] = useState({});
    const [showMeasure, setShowMeasure] = useState(true);
    const selectRef = useRef(null);
    /*基础Dom*/
    const SelectDom = <Select ref={ref} {...props} />;
    /*用来测量下拉菜单宽度的dom*/
    const SelectDomForMeasure = createPortal(
      cloneElement(SelectDom, {
        open: true /*展开*/,
        ref: selectRef,
        style: {
          ...props.style,
          position: 'fixed',
          top: -9999999,
          left: 0,
          zIndex: -9999999,
        } /*不显示*/,
      }),
      document.body
    );
    /*用来显示的dom*/
    const SelectDomForRender = cloneElement(SelectDom, { style: { ...props.style, ...style } });
    useLayoutEffect(() => {
      /*使用useLayoutEffect依然无法在{SelectDomForMeasure}渲染后同步拿到下拉菜单的dom*/
      queueMicrotask(() => {
        if (!showMeasure) return;
        const menuDom = selectRef.current?.rcSelect.getPopupDOMNode();
        if (!menuDom) return;
        const computedStyles = getComputedStyle(menuDom);
        setStyle({ width: parseFloat(computedStyles.width) + 24 /*选择框的右边距*/ });
        setShowMeasure(false);
      });
    }, [selectRef, showMeasure]);
    return (
      <>
        <div>123123</div>
        <span>what</span>
        <h1>h11111</h1>
        {showMeasure && SelectDomForMeasure}
        {SelectDomForRender}
      </>
    );
  })
);

//for eslint
AutoWidthSelect.propTypes = Select.propTypes;
Object.assign(AutoWidthSelect, Select);

export default AutoWidthSelect;
