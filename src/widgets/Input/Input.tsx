import './input.css';
import {FC, ReactElement} from "react";
import currency from "./currency.svg";
import errorIcon from "../error-icon.svg";
import warningIcon from "./warning.svg";
import info from "./info.svg";
import tooltipArrow from "./tooltip-arrow.svg";

interface InputProps {
  value: number, // controlled component value
  onChange: (value: number) => void, // controlled component handler
  error: string, // string represents is error exist and inform user about error
  label: string, // text information about input
  /*
  * be carefully, if you use max with min,
  * in max should be diff between max and min,
  * because value calculates from zero, not from min
  * */
  max?: number, // maximum value of the input
  min?: number, // minimum value of the inpu
  warning?: string, // text hint in bottom of the input
  tooltip?: ReactElement, // show's information on hover, can be ReactElement
  label2?: ReactElement, // ReactElement in bottom of the input
}

export const Input: FC<InputProps> = (
  {
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
              <img src={info} alt=""/> {/* hoverable part of the tooltip */}
              <img src={tooltipArrow} alt="" className="arrow"/>
              {tooltip}
            </div>
          )}
        </div>
        <div className={`input-element${error ? " error" : ""}`}>
          <input
            type="text"
            /* in input we show result value with additional min if it presents */
            value={(min ? min + value : value).toLocaleString("en-US")}
            onChange={event => {
              let value = +event.target.value.replaceAll(/\D/g, "");

              if (min) {
                onChange(value - min);
              } else {
                onChange(value);
              }
            }}/>
          <img className="currency" src={currency} alt=""/>
          {/* currently slider visible if max prop present */}
          {max ? (
            <div className="slider">
              <div className="line" style={{width: `${value / max * 100}%`}}/>
              <div
                className="circle"
                draggable
                style={{left: `min(${value / max * 100}%, calc(100% - 12px))`}}
                onDrag={event => {
                  // here we calculate variables for future use in new value usage
                  const currentLeftPosition = (event.target as HTMLDivElement).getBoundingClientRect().left;
                  const dragDiff = event.clientX - currentLeftPosition;
                  const parent = ((event.target as HTMLDivElement).parentNode as HTMLDivElement).getBoundingClientRect()
                  const totalWidth = parent.width;

                  // last drag event fires with zero, so we prevent wrong calculations
                  if (event.clientX === 0) {
                    return;
                  }

                  // if circle dragged left of possible area
                  if (event.clientX <= parent.left) {
                    onChange(0);
                    return;
                  }

                  // if circle dragged right of possible area
                  if (event.clientX >= parent.right - 12) {
                    onChange(max);
                    return;
                  }

                  // main value definer
                  onChange(value += Math.round(max * dragDiff / totalWidth));
                }}/>
            </div>
          ) : null}
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