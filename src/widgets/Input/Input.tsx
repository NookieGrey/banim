import './input.css';
import {FC, ReactElement} from "react";
import currency from "./currency.svg";
import errorIcon from "../error-icon.svg";
import warningIcon from "./warning.svg";
import info from "./info.svg";
import tooltipArrow from "./tooltip-arrow.svg";

export const Input: FC<{
  value: number,
  onChange: (value: number) => void,
  error: string,
  label: string,
  // be carefully, if you use max with min, in max should be diff, because value calculates from min
  max?: number,
  min?: number,
  warning?: string,
  tooltip?: ReactElement,
  label2?: ReactElement,
}> = ({
        value,
        onChange,
        error,
        label,
        max,
        warning,
        tooltip,
        min,
        label2,
      }) => {
  return (
    <div className="input-wrapper">
      <label>
        <div className="label">
          {label}
          {tooltip && (
            <div className="info">
              <img src={tooltipArrow} alt="" className="arrow"/>
              <img src={info} alt=""/>
              {tooltip}
            </div>
          )}
        </div>
        <div className={`input-element${error ? " error" : ""}`}>
          <input type="text" value={(min ? min + value : value).toLocaleString("en-US")} onChange={event => {
            let value = +event.target.value.replaceAll(/\D/g, "");

            if (min) {
              onChange(value - min);
            } else {
              onChange(value);
            }
          }}/>
          <img className="currency" src={currency} alt=""/>
          {max ? (<div className="slider">
            <div className="line" style={{width: `${value / max * 100}%`}}/>
            <div className="circle" draggable style={{left: `min(${value / max * 100}%, calc(100% - 12px))`}}
                 onDrag={event => {
                   const currentLeftPosition = (event.target as HTMLDivElement).getBoundingClientRect().left;
                   const dragDiff = event.clientX - currentLeftPosition;
                   const parent = ((event.target as HTMLDivElement).parentNode as HTMLDivElement).getBoundingClientRect()
                   const totalWidth = parent.width;

                   // last drag event fires with zero
                   if (event.clientX === 0) {
                     return;
                   }

                   if (event.clientX <= parent.left) {
                     onChange(0);
                     return;
                   }
                   if (event.clientX >= parent.right - 12) {
                     onChange(max);
                     return;
                   }

                   onChange(value += Math.round(max * dragDiff / totalWidth));
                 }}/>
          </div>) : null}
        </div>
        {label2}
        {warning && (
          <div className="warning">
            <img className="warning-icon" src={warningIcon} alt=""/>
            <span dangerouslySetInnerHTML={{__html: warning}}/>
          </div>
        )}
        {error && (
          <div className="error-text">
            <img className="error-icon" src={errorIcon} alt=""/>
            <span>
              {error}
            </span>
          </div>
        )}
      </label>
    </div>
  )
}