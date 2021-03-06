import React, { Component, Fragment } from 'react';
import PropTypes from "prop-types";
import * as Styled from './styles';
import calendar, {
  isDate,
  isSameDay,
  isSameMonth,
  getDateISO,
  getNextMonth,
  getPreviousMonth,
  WEEK_DAYS,
  CALENDAR_MONTHS
} from '../../helpers/calendar';
import Timepicker from "../Timepicker";

class Calendar extends Component {
  state = {
    ...this.resolveStateFromProp(), 
    time: this.props.time,
    today: new Date(),
    TimepickerOpen: false,
  };

  handleTimeChange = time  => {
    const { onDateChanged } = this.props;

    this.state.time !== time &&
    this.setState({...this.state, ...{ time, timepickerOpen: false }}, () => {
      typeof onDateChanged === 'function' && onDateChanged(this.state.current, this.state.time);
    });
  };
  
  handleTimeClose = () => {
    this.setState({...this.state, ...{ timepickerOpen: false }});
  };

  resolveStateFromDate(date) {
    const isDateObject = isDate(date);
    const _date = isDateObject ? date : new Date();
    
    return {
      current: isDateObject ? date : null,
      month: +_date.getMonth() + 1,
      year: _date.getFullYear()
    };
  }
  
  resolveStateFromProp() {
    return this.resolveStateFromDate(this.props.date);
  }
  
  componentDidMount() {
    const now = new Date();
    const tomorrow = new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000;
    const ms = tomorrow - now;
    
    this.dayTimeout = setTimeout(() => {
      this.setState({ today: new Date() }, this.clearDayTimeout)
    }, ms);
  };
  
  componentDidUpdate(prevProps) {
    const { date, onDateChanged } = this.props;
    const { date: prevDate } = prevProps;
    const dateMatch = date === prevDate || isSameDay(date, prevDate);
    
    !dateMatch &&
      this.setState(this.resolveStateFromDate(date), () => {
        typeof onDateChanged === 'function' && onDateChanged(date);
      });
  }
  
  clearDayTimeout = () => {
    this.dayTimeout && clearTimeout(this.dayTimeout);   
  };
  
  componentWillUnmount() {
    this.clearPressureTimer();
    this.clearDayTimeout();
  }
  
  getCalendarDates = () => {
    const { current, month, year } = this.state;
    const calendarMonth = month || +current.getMonth() + 1;
    const calendarYear = year || current.getFullYear();
    
    return calendar(calendarMonth, calendarYear);
  };
  
  openTimepicker = date => evt => {
    evt && evt.preventDefault();
    
    this.setState({
      ...this.state, 
      ...{ 
        timepickerOpen: true, 
        time: isSameDay(this.state.current, date) ? this.state.time : null 
      },
      ...this.resolveStateFromDate(date),
    });
  };
  
  gotoPreviousMonth = () => {
    const { month, year } = this.state;
    this.setState(getPreviousMonth(month, year));
  };
  
  gotoNextMonth = () => {
    const { month, year } = this.state;
    this.setState(getNextMonth(month, year));
  };
  
  gotoPreviousYear = () => {
    const { year } = this.state;
    this.setState({ year: year - 1});
  };
  

  gotoNextYear = () => {
    const { year } = this.state;
    this.setState({ year: year + 1});
  };

  handlePressure = fn => {
    if (typeof fn === 'function') {
      fn();
      
      this.pressureTimeout = setTimeout(() => {
        this.pressureTimer = setInterval(fn, 100);  
      }, 500);
    }   
  };
  
  clearPressureTimer = () => {
    this.pressureTimer && clearInterval(this.pressureTimer);
    this.pressureTimeout && clearTimeout(this.pressureTimeout);
  };
  
  handlePrevious = evt => {
    evt && evt.preventDefault();
    const fn = evt.shiftKey ? this.gotoPreviousYear() : this.gotoPreviousMonth();
    this.handlePressure(fn);
  };
  
  handleNext = evt => {
    evt && evt.preventDefault();
    const fn = evt.shiftKey ? this.gotoNextYear() : this.gotoNextMonth();
    this.handlePressure(fn);
  };
  
  renderMonthAndYear = () => {
    const { month, year } = this.state;
    
    const monthname = Object.values(CALENDAR_MONTHS)[
      Math.max(0, Math.min(month - 1, 11))  
    ];
    
    return (
      <Styled.CalendarHeader>
        <Styled.ArrowLeft
          onMouseDown={this.handlePrevious}
          onMouseUp={this.clearPressureTimer}
          title="Предыдущий месяц"
        />
        
        <Styled.CalendarMonth>
          {monthname} {year}
        </Styled.CalendarMonth>
        
        <Styled.ArrowRight
          onMouseDown={this.handleNext}
          onMouseUp={this.clearPressureTimer}
          title="Следующий месяц"
        />
      </Styled.CalendarHeader>  
    );
  };
  
  renderDayLabel = (day, index) => {
    const dayLabel = WEEK_DAYS[day].toUpperCase();
    
    return (
      <Styled.CalendarDay key={dayLabel} index={index}>
        {dayLabel}
      </Styled.CalendarDay>
    )
  };
  
  renderCalendarDate = (date, index) => {
    const { current, month, year, today } = this.state;
    const _date = new Date(date.join("-"));
    
    const isToday = isSameDay(_date, today);
    
    const isCurrent = current && isSameDay(_date, current);
    
    const inMonth = month && year && isSameMonth(_date, new Date([year, month, 1].join("-")));
    
    const props = { index, inMonth, title: _date.toDateString() };
    
    const isDateActive = today.getTime() < _date.getTime() || isToday;
    
    if (isDateActive) {
      props.onClick = this.openTimepicker(_date);   
    }
    
    const DateComponent = isCurrent
      ? Styled.HighlightedCalendarDate
      : isToday
        ? Styled.TodayCalendarDate
        : isDateActive
          ? Styled.CalendarDate
          : Styled.PastCalendarDate;

    return (
      <DateComponent key={getDateISO(_date)} {...props}>  
        {_date.getDate()}
      </DateComponent>
    );
  };
  
  render() {
    const { time, timepickerOpen } = this.state;
    
    return (
      <Styled.CalendarContainer>
        {this.renderMonthAndYear()}
        
        <Styled.CalendarGrid>
          <Fragment>
            {Object.keys(WEEK_DAYS).map(this.renderDayLabel)}
          </Fragment>
          
          <Fragment>
            {this.getCalendarDates().map(this.renderCalendarDate)}
          </Fragment>
        </Styled.CalendarGrid>

        {timepickerOpen && (
          <Timepicker 
            date={this.state.current}
            today={this.state.today}
            time={time} 
            onTimeChanged={this.handleTimeChange} 
            onCancel={this.handleTimeClose} 
          />
        )}
      </Styled.CalendarContainer>  
    );
  }
}

Calendar.propTypes = {
  date: PropTypes.instanceOf(Date),
  onDateChanged: PropTypes.func
};

export default Calendar;