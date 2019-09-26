import React from 'react'
import styled from 'styled-components'

const LegendDiv = styled.div`
    width: 1000px;
    margin: auto;
    display: block;
    height: 25px;
    line-height:25px;
`

const LegendIconSquare = styled.span`
    height: 25px;
    width: 25px;
    display: inline-block;
    border: 1px solid black;
`

const LegendIconCircle = styled(LegendIconSquare)`
    border-radius: 50%;
    height: 10px;
    width: 10px;
    vertical-align: super;
`

const LegendLabel = styled.span`
    vertical-align: top;
    display: inline-block;
    margin: 0 10px;
`

const Legend = () => {
    
    return (
        <div>
            <h3>
                Legend
            </h3>
            <LegendDiv>
                    <LegendIconSquare style={{
                        background: '#3A32769A',
                    }}/> 
                    <LegendLabel>Searched Gene Coding Region</LegendLabel>
                    <LegendIconSquare style={{
                        background: '#AA92391A',
                    }}/> 
                    <LegendLabel>Window Region</LegendLabel>
                    <LegendIconCircle style={{
                        background: 'brown',
                    }}/>
                    <LegendLabel>Searched Gene QTL</LegendLabel>
                    <LegendIconCircle style={{
                        background: '#2B4970',
                    }}/>
                    <LegendLabel>In Window QTL</LegendLabel>
            </LegendDiv>
            <p>
            </p>
        </div>
    )
}

export default Legend