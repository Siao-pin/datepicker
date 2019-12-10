export const THIS_YEAR = +(new Date().getFullYear());

export const THIS_MONTH = +(new Date().getMonth()) + 1;

export const WEEK_DAYS = {
  Monday: 'Пн',
  Tuesday: 'Вт',
  Wednesday: 'Ср',
  Thursday: 'Чт',
  Friday: 'Пт',
  Saturday: 'Сб',
  Sunday: 'Вс',
};

export const CALENDAR_MONTHS = {
  January: "Янв",
  February: "Фев",
  March: "Мар",
  April: "Апр",
  May: "Май",
  June: "Июн",
  July: "Июл",
  August: "Авг",
  September: "Сен",
  October: "Окт",
  November: "Ноя",
  December: "Дек"  
};

export const CALENDAR_WEEKS = 6;

export const zeroPad = (value, length) => {
  return `${value}`.padStart(length, '0');  
};

export const getMonthDays = (month = THIS_MONTH, year = THIS_YEAR) => {
  const months30 = [4, 6, 9, 11];
  const leapYear = year % 4 === 0;
  
  return month === 2
    ? leapYear ? 29 : 28
    : months30.includes(month) ? 30 : 31
  ;
};

export const getMonthFirstDay = (month = THIS_MONTH, year = THIS_YEAR) => {
  return +(new Date(`${year}-${zeroPad(month, 2)}-01`).getDay()) + 1;  
};

export const isDate = date => {
  const isDate = Object.prototype.toString.call(date) === '[object Date]';
  const isValidDate = date && !Number.isNaN(date.valueOf());
  
  return isDate && isValidDate;
};

export const isSameMonth = (date, basedate = new Date()) => {
  if (!(isDate(date) && isDate(basedate))) {
    return false;
  }  
  
  const basedateMonth = +(basedate.getMonth()) + 1;
  const basedateYear = basedate.getFullYear();
  
  const dateMonth = +(date.getMonth()) + 1;
  const dateYear = date.getFullYear();
  
  return (+basedateMonth === +dateMonth)
    && (+basedateYear === +dateYear);
};

export const isSameDay = (date, basedate = new Date()) => {

  if (!(isDate(date) && isDate(basedate))) return false;

  const basedateDate = basedate.getDate();
  const basedateMonth = +(basedate.getMonth()) + 1;
  const basedateYear = basedate.getFullYear();

  const dateDate = date.getDate();
  const dateMonth = +(date.getMonth()) + 1;
  const dateYear = date.getFullYear();

  return (+basedateDate === +dateDate) 
    && (+basedateMonth === +dateMonth) 
    && (+basedateYear === +dateYear);
};

export const getDateISO = (date = new Date) => {

  if (!isDate(date)) return null;

  return [
    date.getFullYear(),
    zeroPad(+date.getMonth() + 1, 2),
    zeroPad(+date.getDate(), 2)
  ].join('-');

};

export const getPreviousMonth = (month, year) => {
  const prevMonth = (month > 1) ? month - 1 : 12;
  const prevMonthYear = (month > 1) ? year : year - 1;
  
  return { month: prevMonth, year: prevMonthYear };
};

export const getNextMonth = (month, year) => {
  const nextMonth = (month < 12) ? month + 1 : 1;
  const nextMonthYear = (month < 12) ? year : year + 1;

  return { month: nextMonth, year: nextMonthYear };
};