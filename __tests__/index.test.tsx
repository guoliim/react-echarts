import React from "react"
import { render } from "@testing-library/react"
import "@testing-library/jest-dom/extend-expect"
import echarts from 'echarts'
import styled from '@emotion/styled'

import Chart from '../src'

test('test charts example', () => {

    const StyledChart = styled(Chart)`
        width: 600px;
        height: 200px;
    `

    const option = {
        xAxis: {
            type: 'category',
            data: ['Mon', 'Mon', 'Tue', 'Tue', 'Tue', 'Tue', 'Tue']
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line'
        }]
    }

    const { container } = render(
        <StyledChart
            echarts={echarts}
            data={{
                option,
                on: [
                    {
                        event: 'click',
                        handler: (params) => {console.log('click', params)},
                    }
                ]
            }}
            onEchartsReady={(echarts) => {
                console.log('ready', echarts)
            }}
        />
    )

    const chart = container.querySelector('[_echarts_instance_]:not([_echarts_instance_=""])')
    const svg = container.querySelector('svg')
    
    expect(chart).toBeDefined()
    expect(chart).toBeInTheDocument()
    expect(chart).toHaveClass('react-echarts-container')
    expect(chart).toContainElement(svg)
    expect(svg).toHaveAttribute('height', '200')
    expect(svg).toHaveAttribute('width', '600')
})