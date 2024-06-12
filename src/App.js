import React, { useEffect, useState } from "react";

function App() {
  const [sets, setSets] = useState([
    {
      loanSize: "120000",
      percent: 27,
      startDate: "2024-01-12",
      endDate: "2024-09-01",
      accrualsPerYear: 1,
    },
    {
      loanSize: "140000",
      percent: 25,
      startDate: "2024-01-03",
      endDate: "2026-11-15",
      accrualsPerYear: 4,
    },
    {
      loanSize: "150000",
      percent: 23,
      startDate: "2024-03-05",
      endDate: "2025-12-20",
      accrualsPerYear: 2,
    },
    {
      loanSize: "180000",
      percent: 21,
      startDate: "2024-04-18",
      endDate: "2027-07-31",
      accrualsPerYear: 12,
    },
  ]);
  const [indexC, setIndexC] = useState(0);
  const [loanSize, setLoanSize] = useState(sets[0].loanSize);
  const [percent, setPercent] = useState(sets[0].percent);
  const [startDate, setStartDate] = useState(sets[0].startDate);
  const [endDate, setEndDate] = useState(sets[0].endDate);
  const [accrualsPerYear, setAccrualsPerYear] = useState(
    sets[0].accrualsPerYear
  );
  const [method, setMethod] = useState("факт/факт");
  const [type, setType] = useState("КБ");
  const [term, setTerm] = useState(0);
  const [finalResult, setFinalResult] = useState(0);
  const [paymentsSchedule, setPaymentsSchedule] = useState([]);

  const formSchedule = () => {
    let termDays = 30;
    let resultSchedule = [];
    if (startDate == "0000-00-00" || endDate == "0000-00-00")
      return resultSchedule;

    let currentDate = new Date(startDate);
    let endDateObj = new Date(endDate);

    if (method == "30/360") {
      do {
        let date = new Date(startDate);
        date.setDate(date.getDate() + termDays);
        termDays += 30;
        resultSchedule.push(date.toISOString().slice(0, 10));
        if (termDays > term) termDays = term;
        if (termDays == term) termDays += 10;
      } while (termDays < term);
    } else if (method == "факт/факт" || method == "факт/360") {
      while (currentDate <= endDateObj) {
        let daysInMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        ).getDate();
        let nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + daysInMonth);
        resultSchedule.push(currentDate.toISOString().slice(0, 10));
        currentDate = nextDate;
      }
    }
    setPaymentsSchedule(resultSchedule);
  };

  const functionKB = () => {
    return Math.round(loanSize * (1 + (percent * term) / (360 * 100)));
  };
  const functionMB = () => {
    return Math.round(
      Math.pow(
        loanSize * (1 + percent / accrualsPerYear),
        Math.round(term / 360)
      )
    );
  };

  const reset = () => {
    setLoanSize(0);
    setPercent(0);
    setStartDate("0000-00-00");
    setEndDate("0000-00-00");
    setAccrualsPerYear(0);
    setPaymentsSchedule([]);
  };

  useEffect(() => {
    setFinalResult(function () {
      if (type == "КБ") {
        return functionKB();
      } else {
        return functionMB();
      }
    });
    formSchedule();
  }, [
    loanSize,
    percent,
    term,
    accrualsPerYear,
    method,
    type,
    functionKB,
    functionMB,
  ]);

  useEffect(() => {
    setTerm((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
  }, [startDate, endDate]);

  const setValues = (index) => {
    setSets((prevSets) => {
      const newSets = [...prevSets];
      newSets[indexC] = {
        loanSize,
        percent,
        startDate,
        endDate,
        accrualsPerYear,
      };
      return newSets;
    });

    setIndexC(index);
    setLoanSize(sets[index].loanSize);
    setPercent(sets[index].percent);
    setStartDate(sets[index].startDate);
    setEndDate(sets[index].endDate);
    setAccrualsPerYear(sets[index].accrualsPerYear);
    setPaymentsSchedule(formSchedule());
  };

  return (
    <div className="App">
      <div className="form-container">
        <div className="form-presets">
          {sets.map((set, index) => (
            <button
              onClick={() => {
                setValues(index);
              }}
              key={index}
            >
              Варіант {index + 1}
            </button>
          ))}
          <button
            style={{ color: "transparent", backgroundColor: "transparent" }}
          >
            PH
          </button>
        </div>
        <form className="form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-row">
            <label htmlFor="loan-size">{"Розмір кредиту (грн):"}</label>
            <input
              required
              id="loan-size"
              type="number"
              value={loanSize}
              onChange={(e) => setLoanSize(e.target.value)}
            ></input>
          </div>
          <div className="form-row">
            <label htmlFor="percent">{"Річна ставка (%):"}</label>
            <input
              required
              id="percent"
              type="number"
              value={percent}
              onChange={(e) => setPercent(e.target.value)}
            ></input>
          </div>
          <div className="form-row">
            <label htmlFor="percent">{"Кількість нарахувань за рік:"}</label>
            <input
              required
              id="percent"
              type="number"
              value={accrualsPerYear}
              onChange={(e) => setAccrualsPerYear(e.target.value)}
            ></input>
          </div>
          <div className="form-row">
            <label htmlFor="loan-term-from">{"Термін позички: з"}</label>
            <input
              required
              id="loan-term-from"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            ></input>
            <label htmlFor="loan-term-to" style={{ marginLeft: "15px" }}>
              {"по"}
            </label>
            <input
              required
              id="loan-term-to"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            ></input>
          </div>
          <div className="form-row">
            <button
              onClick={() => {
                reset();
              }}
            >
              Скинути
            </button>
            <select value={method} onChange={(e) => setMethod(e.target.value)}>
              <option value="факт/факт">факт/факт</option>
              <option value="факт/360">факт/360</option>
              <option value="30/360">30/360</option>
            </select>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="КБ">КБ</option>
              <option value="МБ">МБ</option>
            </select>
            {/* <button onClick={() => console.log(functionMB())}>Обчислити</button> */}
          </div>
        </form>
      </div>
      <section className="result-container">
        <div>Сума відсотка: {finalResult - loanSize || 0}</div>
        <div>Загальний розмір боргу: {finalResult || 0}</div>
        <div>
          <div>
            Графік погашення кредиту з щомісячним поверненням{" "}
            {Math.round(finalResult / paymentsSchedule?.length) || 0} грн:
          </div>
          <div className="scheduleContainer">
            {paymentsSchedule?.length ? (
              paymentsSchedule.map((date) => (
                <div className="scheduleItem" key={date}>
                  {date}
                </div>
              ))
            ) : (
              <div className="scheduleItem">Немає розкладу</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
