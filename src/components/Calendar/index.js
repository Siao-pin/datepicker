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

class Calendar extends Component {
  state = {...this.resolveStateFromProp(), today: new Date()};
 
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
  
  getCalendarDates = () => {
    const { current, month, year } = this.state;
    const calendarMonth = month || +current.getMonth() + 1;
    const calendarYear = year || current.getFullYear();
    
    return calendar(calendarMonth, calendarYear);
  };
  
  renderMonthAndYear = () => {
    const { month, year } = this.state;
    
    const monthname = Object.keys(CALENDAR_MONTHS)[
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
    
    const onClick = this.gotoDate(_date);
    
    const props = { index, inMonth, onClick, title: _date.toDateString() };
    
    const DateComponent = isCurrent
      ? Styled.HighlightedCalendarDate
      : isToday
        ? Styled.TodayCalendarDate
        : Styled.CalendarDate;
    
    return (
      <DateComponent key={getDateISO(_date)} {...props}>  
        {_date.getDate()}
      </DateComponent>
    );
  };
  
  render() {
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
      </Styled.CalendarContainer>  
    );
  }
}

Calendar.propTypes = {
  date: PropTypes.instanceOf(Date),
  onDateChanged: PropTypes.func
};

export default Calendar;