import './select.css';

import {FC, useEffect, useRef, useState} from "react";

import caret from "./caret.svg";
import search from "./search.svg";
import check from "./check.svg";
import errorIcon from "../error-icon.svg";

interface SelectProps {
  options: string[], // array of strings which from value can be selected
  error: string, // string represents is error exist and inform user about error
  optionIndex: number, // controlled component value
  setOptionIndex: (index: number) => void, // controlled component handler
  label: string, // text information about input
  placeholder: string, // default text to be shown when value equals -1
  withSearch?: boolean, // also we can enable autocomplete search inside dropdown if needed
}

export const Select: FC<SelectProps> = (
  {
    options,
    error,
    optionIndex,
    setOptionIndex,
    label,
    placeholder,
    withSearch,
  }) => {
  // additional variable to hide on click outside of dropdown
  const ref = useRef<HTMLDivElement | null>(null);

  // determinants dropdown visibility
  const [opened, setOpened] = useState(false);

  // searched value stores here
  const [optionSearch, setOptionSearch] = useState("");

  // by default use option[]
  // and if search presents filters them by search value
  let filteredOptions: (string | null)[] = options;
  if (withSearch) {
    filteredOptions = options.map(option => {
      if (option.toLowerCase().search(optionSearch.toLowerCase()) === -1) {
        return null
      } else {
        return option;
      }
    })
  }

  // construction to listen click event outside of dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpened(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);


  return (
    <div ref={ref} className={`select-wrapper${opened ? " open" : ""}`}>
      <div className="label" onClick={() => setOpened(bool => !bool)}>{label}</div>
      <div className={`select-element${error ? " error" : ""}`} onClick={() => setOpened(bool => !bool)}>
        {optionIndex === -1 ? (
          // show text if value not exists yet
          <div className="text muted">{placeholder}</div>
        ) : (
          <div className="text">{options[optionIndex]}</div>
        )}
        <img src={caret} className="caret" alt=""/>
      </div>
      {error && (
        <div className="error-text">
          <img className="error-icon" src={errorIcon} alt=""/>
          <span>
            {error}
          </span>
        </div>
      )}
      {opened && (
        <div className="dropdown">
          {withSearch && (
            <div className="search">
              <img src={search} alt="" className="icon"/>
              <input
                type="text" placeholder="Поиск..." value={optionSearch}
                onChange={event => setOptionSearch(event.target.value)}
              />
            </div>
          )}
          <div className="cities">
            {filteredOptions.map((city, index) => !city ? null : (
              <div
                className="text"
                onClick={() => {
                  setOpened(false);
                  setOptionSearch("");
                  setOptionIndex(index);
                }}
              >
                {city}
                {index === optionIndex && (
                  <img src={check} alt=""/>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}