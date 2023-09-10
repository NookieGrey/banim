import './calculator.css'
import {useState} from 'react'
import {Select} from "./widgets/Select/Select";
import {Input} from "./widgets/Input/Input";

const maxPrice = 10000000;

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

const periods = [
  "В ближайший месяц",
  "В ближайшие 2 месяц",
  "В ближайшие 3 месяца",
  "В ближайшие 6 месяцев",
]

const types = [
  "Квартира от застройщика",
  "Квартира на вторичном рынке",
  "Частный дом",
  "Земельный участок / Строительство",
  "Коммерческая недвижимость",
]

const owns = [
  "Нет, я пока не владею недвижимостью",
  "Да, у меня уже есть недвижимость в собственности",
  "Я собираюсь продать единственную недвижимость в ближайшие два года, чтобы использовать полученный капитал для приобретения новой"
]

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

const minDuration = 4;
const maxDuration = 30;
const diffDuration = maxDuration - minDuration;

export function Calculator() {
  const [price, setPrice] = useState(1000000);
  const [priceError, setPriceError] = useState("");

  const onPriceChange = (price: number) => {
    if (!price) {
      setPriceError('Введите значение')
    } else if (price > maxPrice) {
      setPriceError(`Стоимость недвижимости не может превышать ${maxPrice.toLocaleString('en-US')}`)
    } else {
      setPriceError("")
    }

    setPrice(price);
  }

  const [firstPayment, setFirstPayment] = useState(500000);
  const [firstPaymentError, setFirstPaymentError] = useState("");

  const onFirstPaymentChange = (firstPayment: number) => {
    if (!firstPayment) {
      setFirstPaymentError('Введите значение')
    } else if (firstPayment > price) {
      setFirstPaymentError(`Первоначальный взнос не может превышать стоимость недвижимости`)
    } else if (firstPayment * 4 < price) {
      setFirstPaymentError("Сумма первоначального взноса не может быть меньше 25% от стоимости недвижимости")
    } else {
      setFirstPaymentError("")
    }

    setFirstPayment(firstPayment);
  }

  const [cityIndex, setCityIndex] = useState(-1);
  const [periodIndex, setPeriodIndex] = useState(-1);
  const [typeIndex, setTypeIndex] = useState(-1);
  const [ownIndex, setOwnIndex] = useState(-1);
  const [cityError, setCityError] = useState(false);
  const [periodError, setPeriodError] = useState(false);
  const [typeError, setTypeError] = useState(false);
  const [ownError, setOwnError] = useState(false);

  const [duration, setDuration] = useState(26);
  const [durationError, setDurationError] = useState("");

  const onDurationChange = (duration: number) => {
    if (duration > diffDuration) {
      setDurationError(`Cрок ипотеки не может превышать ${maxDuration} лет`)
    } else {
      setDurationError("")
    }

    setDuration(duration);
    setMonthlyPayment(Math.round((price - firstPayment) / (duration + minDuration) / 12 - minMonthlyPayment))
  }

  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [monthlyPaymentError, setMonthlyPaymentError] = useState("");

  const minMonthlyPayment = Math.round((price - firstPayment) / (maxDuration) / 12);
  const maxMonthlyPayment = Math.round((price - firstPayment) / (minDuration) / 12);

  const onMonthlyPaymentChange = (monthlyPayment: number) => {
    if (monthlyPayment < 0) {
      setMonthlyPaymentError(`Размер ежемесячного платежа не может быть меньше ${minMonthlyPayment.toLocaleString('en-US')} иначе срок будет больше ${maxDuration} лет`)
    } else if (monthlyPayment > maxMonthlyPayment - minMonthlyPayment) {
      setMonthlyPaymentError(`превышен максимально возможный срок ежемесячного платежа`)
    } else {
      setMonthlyPaymentError("")
    }

    setMonthlyPayment(monthlyPayment);

    setDuration(Math.round((price - firstPayment) / (monthlyPayment + minMonthlyPayment) / 12 - minDuration))
  }

  const buttonActive = !priceError && !firstPaymentError && cityIndex !== -1 && periodIndex !== -1 && typeIndex !== -1 && ownIndex !== -1 && !durationError && !monthlyPaymentError;


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
            warning={`Cумма финансирования: <strong>${firstPayment.toLocaleString("en-US")}</strong> ₪ <br/>  Процент финансирования:${Math.round(firstPayment / price * 100)}%`}
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
        }}>Продолжить
        </button>
      </div>
    </div>
  )
}
