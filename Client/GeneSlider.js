import React, { Component } from 'react';
import styled from 'styled-components'

import Slider from '@material-ui/lab/Slider'

const SliderDiv = styled.div`
    width: 1000px;
    margin: 10px auto;
`

function valuetext(value) {
  return `${value}°C`;
}

export default function GeneSlider() {
  const [value, setValue] = React.useState([20, 37]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
        <p>BP Range</p>
        <SliderDiv>
            <Slider
                value={value}
                onChange={handleChange}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                getAriaValueText={valuetext}
            />
        </SliderDiv>
    </div>
  );
}