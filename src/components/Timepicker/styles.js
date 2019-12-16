import styled from 'styled-components';

export const TimepickerContainer = styled.div`
  border: 2px solid #06c;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: #fff;
  overflow-y: scroll;
`;

export const TimepickerElement = styled.div`
  text-transform: uppercase;
  color: #06c;
  display: flex;
  align-items: center;
  justify-content: left;
  cursor: pointer;
  font-size: 1.2rem;
  padding: .5rem;
  box-sizing: border-box;
`;

export const TimepickerTimeSlot = styled(TimepickerElement)`
  justify-content: center;
  :hover {
    color: #03c;
  }
`;

export const TimepickerTimeSlotHighlighted = styled(TimepickerTimeSlot)`
  color: #fff;
  background: #06c;  
  :hover {
    color: #fff;
  }
`;

