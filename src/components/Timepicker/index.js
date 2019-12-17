import React, { Component } from 'react';
import * as Styled from './styles';
import { generateTimeSlots } from '../../helpers/time_slots';
import { isSameDay } from '../../helpers/calendar';

class Timepicker extends Component {
  state = { time: null, step: 30 };
  
  componentDidMount() {
    const { time, step } = this.props;
    const newStep = step && step >= 5 && step <= 60 && 60 % step === 0 ? step : this.state.step;
    
    (time || newStep) && this.setState({ ...this.state, ...{ time, step: newStep } });
  }
  
  timeChangeHandler = (time) => {
    this.setState({...this.state, ...{ time }}, () => {
      this.props.onTimeChanged(time);  
    });  
  };
 
  renderTimeSlot = (time, index) => {
    const { date, today } = this.props;

    const [hour, minute] = time.split(':');
    const curTime = today;
    curTime.setHours(+hour);
    curTime.setMinutes(+minute);
    
    const isDisabled = isSameDay(date, today) 
      && curTime.getTime() <= (new Date()).getTime();
    
    if (isDisabled) {
      return null;
    }
    
    const TimeSlotComponent = time === this.state.time 
      ? Styled.TimepickerTimeSlotHighlighted
      : isDisabled
        ? Styled.TimepickerTimeSlotDisabled
        : Styled.TimepickerTimeSlot
    ;

    const props = {key: index};
    
    if (!isDisabled) {
      props.onClick = () => this.timeChangeHandler(time);  
    }
    
    return (
      <TimeSlotComponent {...props}>
        {time}
      </TimeSlotComponent>
    )
  };

  render() {
    return (<Styled.TimepickerContainer>
      <Styled.TimepickerElement onClick={this.props.onCancel}>&lt; Назад</Styled.TimepickerElement>
      {generateTimeSlots(this.state.step).map(this.renderTimeSlot)}          
    </Styled.TimepickerContainer>);
  }
}

export default Timepicker;
