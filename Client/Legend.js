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
                {/* <LegendIconSquare style={{
                    background: '#d4e4ff',
                }} />
                <LegendLabel>Searched Gene Coding Region</LegendLabel>
                <LegendIconSquare style={{
                    background: '#f0f0f0',
                }} />
                <LegendLabel>Window Region</LegendLabel> */}
                <LegendIconCircle style={{
                    background: '#5e94eb',
                }} />
                <LegendLabel>Searched Gene pQTL</LegendLabel>
                <LegendIconCircle style={{
                    background: '#1c4587',
                }} />
                <LegendLabel>Searched Gene eQTL</LegendLabel>
                <LegendIconCircle style={{
                    background: '#d52e2e',
                }} />
                <LegendLabel>In Window pQTL</LegendLabel>
                <LegendIconCircle style={{
                    background: '#780000',
                }} />
                <LegendLabel>In Window eQTL</LegendLabel>
            </LegendDiv>
            <p>
            </p>
        </div>
    )
}

export default Legend