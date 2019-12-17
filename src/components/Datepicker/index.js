import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Calendar from '../Calendar';
import * as Styled from './styles';
import { isDate, getDateISO } from "../../helpers/calendar";

class Datepicker extends Component {
  state = { date: null, time: null, calendarOpen: false };
  
  toggleCalendar = () => this.setState({ calendarOpen: !this.state.calendarOpen });
  
  handleChange = evt => evt.preventDefault();
  
  handleDateChange = (date, time) => {
    const { onDateChanged } = this.props;
    const { date: currentDate } = this.state;
    const newDate = date ? getDateISO(date) : null;
    
    (currentDate !== newDate || time !== this.time) &&
      this.setState({ date: newDate, time, calendarOpen: false }, () => {
        typeof onDateChanged === 'function' && onDateChanged(this.state.date);  
      });
  };
  
  componentDidMount() {
    const { value: date } = this.props;
    const newDate = date && new Date(date);
    
    isDate(newDate) && this.setState({ date: getDateISO(newDate) });
  }
  
  componentDidUpdate(prevProps) {
    const { value: date } = this.props;
    const { value: prevDate } = prevProps;
    const dateISO = getDateISO(new Date(date));
    const prevDateISO = getDateISO(new Date(prevDate));
    
    dateISO !== prevDateISO && this.setState({ date: dateISO });
  }
  
  render() {
    const { label } = this.props;
    const { date, time, calendarOpen} = this.state;
    const dateStr = date ? date.split("-").reverse().join(" / ") : "";
    const timeStr = time ? time : '??:??';
    const value = date ? `${dateStr} ${timeStr}` : '';
    
    return (
      <Styled.DatePickerContainer>
        <Styled.DatePickerFormGroup>
          <Styled.DatePickerLabel>{label || 'Выберите дату'}</Styled.DatePickerLabel>
          
          <Styled.DatePickerInput
            type="text"
            value={value}
            onChange={this.handleChange}
            readOnly="readonly"
            placeholder="ДД / ММ / ГГГГ ЧЧ:мм"
          />
        </Styled.DatePickerFormGroup>
        
        <Styled.DatePickerDropdown isOpen={calendarOpen} toggle={this.toggleCalendar}>
          <Styled.DatePickerDropdownToggle color="transparent" />
          
          <Styled.DatePickerDropdownMenu>
            {calendarOpen && (
              <Calendar time={time} date={date && new Date(date)} onDateChanged={this.handleDateChange} />
            )}
          </Styled.DatePickerDropdownMenu>
        </Styled.DatePickerDropdown>
      </Styled.DatePickerContainer>  
    );
  }
}

Datepicker.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onDateChanged: PropTypes.func
};

export default Datepicker;