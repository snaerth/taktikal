import React, { useState } from "react";
import SearchIcon from "./search.svg";
import data from "./data";
import styles from "./SelectBox.module.css";

const {
  inputContainer,
  input,
  searchIcon,
  dropdown,
  dropdownItem,
  dropdownItemActive,
  emailTxt,
  noResults,
} = styles;
const UP_KEY_CODE = 38;
const DOWN_KEY_CODE = 40;
const ENTER_KEY_CODE = 13;

function SelectBox() {
  const [value, setValue] = useState("");
  const [items, setItems] = useState(null);
  const [active, setActive] = useState(0);

  const onChange = (e) => {
    const { value } = e.target;
    setValue(value);

    const valueLowerCase = value.toLowerCase();

    if (!value) {
      setItems([]);
    } else {
      const filteredData = data.filter(
        ({ name, email }) =>
          name.toLowerCase().includes(valueLowerCase) ||
          email.toLowerCase().includes(valueLowerCase)
      );
      setItems(filteredData);
    }
  };

  const onKeyDown = (e) => {
    if (items && items.length > 0) {
      if (e.keyCode === UP_KEY_CODE && active > 0) {
        setActive(active - 1);
      } else if (
        e.keyCode === DOWN_KEY_CODE &&
        active >= 0 &&
        active < items.length - 1
      ) {
        setActive(active + 1);
      } else if (e.keyCode === ENTER_KEY_CODE) {
        setValue("");
        setItems(null);
      }
    }
  };

  const onMouseEnter = (e) => {
    const idx = Number(e.target.getAttribute("data-id"));

    if (active !== idx) {
      setActive(idx);
    }
  };

  const onItemClick = (e) => {
    setActive(Number(e.target.parentNode.getAttribute("data-id")));
    setValue("");
    setItems(null);
  };

  const hightlightSubstring = (text) => {
    const regex = new RegExp(value, "gi");
    const hasFirstLetterUpperCase =
      value.charAt(0) === value.charAt(0).toUpperCase();

    return text.replace(
      regex,
      `<strong>${
        hasFirstLetterUpperCase ? value : value.toLowerCase()
      }</strong>`
    );
  };

  return (
    <div>
      <div className={inputContainer}>
        <img src={SearchIcon} className={searchIcon} alt="Search Icon" />
        <input
          className={input}
          placeholder="Þekktir viðtakendur"
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={value}
        />
      </div>
      {items && items.length > 0 && (
        <div className={dropdown}>
          {items.map(({ name, email }, idx) => {
            return (
              <div
                className={`${dropdownItem}  ${
                  active === idx ? dropdownItemActive : ""
                }`}
                key={email}
                onMouseEnter={onMouseEnter}
                data-id={idx}
                onClick={onItemClick}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: hightlightSubstring(name),
                  }}
                />
                <div
                  className={emailTxt}
                  dangerouslySetInnerHTML={{
                    __html: hightlightSubstring(email),
                  }}
                />
              </div>
            );
          })}
        </div>
      )}
      {items && items.length === 0 && value !== "" && (
        <div className={dropdown}>
          <p className={noResults}>
            <i>Engar niðurstöður</i>
          </p>
        </div>
      )}
    </div>
  );
}

export default SelectBox;
