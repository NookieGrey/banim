import './calculator.css'
import {useState} from 'react'
import {Select} from "./widgets/Select/Select";
import {Input} from "./widgets/Input/Input";

// max possible value of the price
const maxPrice = 10000000;

// array of available cities shown in dropdown
const cities = [
  "Тель-Авив",
  "Акко",
  "Ашкелон",
  "Беэр-Шева",
  "Кесария",
  "Эйлат",
  "Эйн-Бокек",
  "Хайфа",
  "Герцлия",
  "Иерусалим",
  "Маалот-Таршиха",
  "Мицпе-Рамон",
  "Нахария",
  "Назарет",
  "Нетания",
  "Неве-Атив",
  "Реховот",
  "Цфат",
  "Тверия",
  "Зихрон-Яаков",
];

// array of available periods shown in dropdown
const periods = [
  "В ближайший месяц",
  "В ближайшие 2 месяц",
  "В ближайшие 3 месяца",
  "В ближайшие 6 месяцев",
]

// array of available types shown in dropdown
const types = [
  "Квартира от застройщика",
  "Квартира на вторичном рынке",
  "Частный дом",
  "Земельный участок / Строительство",
  "Коммерческая недвижимость",
]

// array of available owns shown in dropdown
const owns = [
  "Нет, я пока не владею недвижимостью",
  "Да, у меня уже есть недвижимость в собственности",
  "Я собираюсь продать единственную недвижимость в ближайшие два года, чтобы использовать полученный капитал для приобретения новой"
]

// predefined component to be shown on hint hover
// some styles included in select.css
const tooltip = (
  <div className="tooltip">
    <div>Основная квартира: у заемщика нет квартиры ставка финансирования</div>
    <div>Максимум до 75%</div>
    <br/>
    <div>Альтернативная квартира: Для заемщика квартира, которую он обязуется продать в течение двух лет ставка
      финансирования
    </div>
    <div>Максимум до 70%</div>
    <br/>
    <div>Вторая квартира или выше: у заемщика уже есть ставка финансирования квартиры</div>
    <div>Максимум до 50%</div>
  </div>
)

const minDuration = 4; // min possible value of duration
const maxDuration = 30; // max possible value of duration
const diffDuration = maxDuration - minDuration; // diff needed to be used with value

const mortgageRateYear = 14.5 / 100; // default mortgage rate by year
const mortgageRateMonth = mortgageRateYear / 12; // default mortgage rate by month

function calculateTotalDebitAmount(totalDebitValue: number, duration: number): number {
  // calculations get from this link
  // https://www.vtb.ru/articles/kak-rasschityvaetsya-ipoteka/
  return Math.round(totalDebitValue * mortgageRateMonth / (1 - Math.pow((1 + mortgageRateMonth), -(duration * 12 + 1))));
}

function calculateDurationByMonthlyPayment(totalDebitValue: number, monthlyPayment: number) {
  // reverse calculations
  // monthlyPayment = totalDebitValue * G / (1 - Math.pow((1 + G), -(duration * 12 + 1)))
  // 1 - Math.pow((1 + G), -(duration * 12 + 1)) = totalDebitValue * G / monthlyPayment
  // 1 - totalDebitValue * G / monthlyPayment = Math.pow((1 + G), -(duration * 12 + 1))
  // a = Math.pow(b, c);
  // c = Math.log(a)/Math.log(b);
  // -(duration * 12 + 1) = Math.log(1 - totalDebitValue * G / monthlyPayment) / Math.log(1 + G)
  return Math.round((-1 * Math.log(1 - totalDebitValue * mortgageRateMonth / monthlyPayment) / Math.log(1 + mortgageRateMonth) - 1) / 12);
}


export function Calculator() {
  const [price, setPrice] = useState(1000000); // on first render show 1,000,000
  const [priceError, setPriceError] = useState("");

  const [firstPayment, setFirstPayment] = useState(500000); // on first render show 50% of price
  const [firstPaymentError, setFirstPaymentError] = useState("");

  const totalDebtValue = price - firstPayment; // needed value till total price

  // variables for selects
  const [cityIndex, setCityIndex] = useState(-1);
  const [periodIndex, setPeriodIndex] = useState(-1);
  const [typeIndex, setTypeIndex] = useState(-1);
  const [ownIndex, setOwnIndex] = useState(-1);

  // selects errors status
  const [cityError, setCityError] = useState(false);
  const [periodError, setPeriodError] = useState(false);
  const [typeError, setTypeError] = useState(false);
  const [ownError, setOwnError] = useState(false);

  const [duration, setDuration] = useState(diffDuration); // on first render should be max possible value
  const [durationError, setDurationError] = useState("");

  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [monthlyPaymentError, setMonthlyPaymentError] = useState("");

  let minMonthlyPayment = calculateTotalDebitAmount(totalDebtValue, maxDuration);
  let maxMonthlyPayment = calculateTotalDebitAmount(totalDebtValue, minDuration);
  if (minMonthlyPayment < 0) minMonthlyPayment = 0;
  if (maxMonthlyPayment < 0) maxMonthlyPayment = 0;

  // button clickable but has disabled styles
  const buttonActive = !priceError && !firstPaymentError && cityIndex !== -1 && periodIndex !== -1 && typeIndex !== -1 && ownIndex !== -1 && !durationError && !monthlyPaymentError;

  // first payment should exist
  // should be less than price
  // and more than 25% of the price
  const checkFirstPaymentError = (price: number, firstPayment: number) => {
    if (!firstPayment) {
      setFirstPaymentError('Введите значение')
    } else if (firstPayment > price) {
      setFirstPaymentError(`Первоначальный взнос не может превышать стоимость недвижимости`)
    } else if (firstPayment * 4 < price) {
      setFirstPaymentError("Сумма первоначального взноса не может быть меньше 25% от стоимости недвижимости")
    } else {
      setFirstPaymentError("")
    }
  }

  // price should exist
  // should be less than max possible value
  const onPriceChange = (price: number) => {
    if (!price) {
      setPriceError('Введите значение')
    } else if (price > maxPrice) {
      setPriceError(`Стоимость недвижимости не может превышать ${maxPrice.toLocaleString('en-US')}`)
    } else {
      setPriceError("")
    }

    checkFirstPaymentError(price, firstPayment);

    setPrice(price);
  }

  const onFirstPaymentChange = (firstPayment: number) => {
    checkFirstPaymentError(price, firstPayment);

    setFirstPayment(firstPayment);
  }

  // duration should be less than max possible value
  const onDurationChange = (duration: number) => {
    if (duration > diffDuration) {
      setDurationError(`Cрок ипотеки не может превышать ${maxDuration} лет`)
    } else {
      setDurationError("")
    }

    setDuration(duration);

    // recalculate monthly payment on duration change
    setMonthlyPayment(calculateTotalDebitAmount(totalDebtValue, duration + minDuration) - minMonthlyPayment)
  }

  // monthly payment should exist
  // should be less than max possible value
  const onMonthlyPaymentChange = (monthlyPayment: number) => {
    if (monthlyPayment < 0) {
      setMonthlyPaymentError(`Размер ежемесячного платежа не может быть меньше ${minMonthlyPayment.toLocaleString('en-US')} иначе срок будет больше ${maxDuration} лет`)
    } else if (monthlyPayment > maxMonthlyPayment - minMonthlyPayment) {
      setMonthlyPaymentError(`превышен максимально возможный срок ежемесячного платежа`)
    } else {
      setMonthlyPaymentError("")
    }

    setMonthlyPayment(monthlyPayment);

    // recalculate duration on monthly payment change
    setDuration(calculateDurationByMonthlyPayment(totalDebtValue, monthlyPayment + minMonthlyPayment) - minDuration);
  }

  return (
    <div className="calculator-page">
      <h1>Рассчитайте ипотеку быстро и просто</h1>
      <div className="row">
        <div className="cell">
          <Input
            value={price}
            onChange={onPriceChange}
            error={priceError}
            label="Стоимость недвижимости"
          />
        </div>
        <div className="cell">
          <Select
            options={cities}
            error={cityError ? "Выберите ответ" : ''}
            optionIndex={cityIndex}
            setOptionIndex={(index) => {
              setCityError(false);
              setCityIndex(index);
            }}
            label="Город покупки недвижимости"
            placeholder="Выберите город"
            withSearch
          />
        </div>
        <div className="cell">
          <Select
            options={periods}
            error={periodError ? "Выберите ответ" : ''}
            optionIndex={periodIndex}
            setOptionIndex={(index) => {
              setPeriodError(false);
              setPeriodIndex(index);
            }}
            label="Когда вы планируете оформить ипотеку?"
            placeholder="Выберите период"
          />
        </div>
      </div>
      <div className="row">
        <div className="cell">
          <Input
            value={firstPayment}
            onChange={onFirstPaymentChange}
            error={firstPaymentError}
            label="Первоначальный взнос"
            max={price}
            warning={`Сумма финансирования: <strong>${firstPayment.toLocaleString("en-US")}</strong> ₪ <br/>  Процент финансирования: ${Math.round(firstPayment / price * 100)}%`}
            tooltip={tooltip}
          />
        </div>
        <div className="cell">
          <Select
            options={types}
            error={typeError ? "Выберите ответ" : ''}
            optionIndex={typeIndex}
            setOptionIndex={(index) => {
              setTypeError(false);
              setTypeIndex(index);
            }}
            label="Тип недвижимости"
            placeholder="Выберите тип недвижимости"
          />
        </div>
        <div className="cell">
          <Select
            options={owns}
            error={ownError ? "Выберите ответ" : ''}
            optionIndex={ownIndex}
            setOptionIndex={(index) => {
              setOwnError(false);
              setOwnIndex(index);
            }}
            label="Вы уже владеете недвижимостью?"
            placeholder="Выберите ответ"
          />
        </div>
      </div>
      <div className="hr"/>
      <div className="row">
        <div className="cell">
          <Input
            value={duration}
            onChange={onDurationChange}
            error={durationError}
            label="Срок ипотеки"
            max={diffDuration}
            min={minDuration}
            label2={(
              <div className="duration-label">
                <div>{minDuration} года</div>
                <div>{maxDuration} лет</div>
              </div>
            )}
          />
        </div>
        <div className="cell">
          <Input
            value={monthlyPayment}
            onChange={onMonthlyPaymentChange}
            error={monthlyPaymentError}
            label="Ежемесячный платеж"
            warning="Увеличьте ежемесячный платеж и переплачивайте меньше"
            label2={(
              <div className="duration-label">
                <div>{minMonthlyPayment.toLocaleString("en-US")} ₪</div>
                <div>{maxMonthlyPayment.toLocaleString("en-US")} ₪</div>
              </div>
            )}
            min={minMonthlyPayment}
            max={maxMonthlyPayment - minMonthlyPayment}
          />
        </div>
      </div>
      <div className="hr full"/>
      <div className="submit-wrapper">
        <button type="button" className={buttonActive ? 'active' : ""} onClick={() => {
          // we check is errors presents and highlight selectors that should be selected
          if (!buttonActive) {
            if (cityIndex === -1) {
              setCityError(true);
            }
            if (periodIndex === -1) {
              setPeriodError(true);
            }
            if (typeIndex === -1) {
              setTypeError(true);
            }
            if (ownIndex === -1) {
              setOwnError(true);
            }
          } else {
            // otherwise store data in localStorage
            localStorage.setItem('result', JSON.stringify({
              price,
              firstPayment,
              city: cities[cityIndex],
              period: periods[periodIndex],
              type: types[typeIndex],
              own: owns[ownIndex],
              duration: duration + minDuration,
              monthlyPayment: monthlyPayment + minMonthlyPayment,
            }))
          }
        }}>
          Продолжить
        </button>
      </div>
    </div>
  )
}
