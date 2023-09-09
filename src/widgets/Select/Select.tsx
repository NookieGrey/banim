import './select.css';

import {FC, useEffect, useRef, useState} from "react";

import caret from "./caret.svg";
import search from "./search.svg";
import check from "./check.svg";
import errorIcon from "../error-icon.svg";

export const Select: FC<{
  options: string[],
  error: string,
  optionIndex: number,
  setOptionIndex: (index: number) => void,
  label: string,
  placeholder: string,
  withSearch?: boolean,
}> = ({
        options,
        error,
        optionIndex,
        setOptionIndex,
        label,
        placeholder,
        withSearch,
      }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [opened, setOpened] = useState(false);
  const [optionSearch, setOptionSearch] = useState("");

  const filteredCities = options.map(city => {
    if (city.toLowerCase().search(optionSearch.toLowerCase()) === -1) {
      return null
    } else {
      return city;
    }
  })

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
            {filteredCities.map((city, index) => !city ? null : (
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