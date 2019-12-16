import React, { Component, Fragment } from 'react';
import * as Styled from './styles';
import { generateTimeSlots } from '../../helpers/time_slots';

class Timepicker extends Component {
  state = { time: null, step: 30 };
  
  componentDidMount() {
    const { time, step } = this.props;
    const newStep = step && step >= 5 && step <= 60 && 60 % step === 0 ? step : this.state.step;
    
    (time || newStep) && this.setState({ ...this.state, ...{ time, step: newStep } });
  }
 
  renderTimeSlot = (time, index) => {
    const TimeSlotComponent = time === this.state.time 
      ? Styled.TimepickerTimeSlotHighlighted
      : Styled.TimepickerTimeSlot
    ;
    
    return (
      <TimeSlotComponent key={index} onClick={() => { this.props.onTimeChanged(time)}}>
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
