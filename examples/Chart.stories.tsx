import React from 'react'
import echarts from 'echarts'
import styled from '@emotion/styled'

import Chart from '../src'

export default {
    title: 'Charts',
    component: Chart,
}

const LineChart = styled(Chart)`
    block-size: 200px;
`

export const LineCharts = () => {

    const handlerTest = React.useCallback((params) => {console.log('click', params)}, [])
    const showLoading = React.useCallback((chart) => {
        chart.clear()
        chart.showLoading({
          text: '努力加载中',
          color: '#333',
          textColor: '#333',
          maskColor: 'transparent'
        })
    }, [])

    const chartData = {
        option: {
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
        },
        on: [
            {
                event: 'click',
                handler: handlerTest,
            },
        ],
    }

    return (
        <LineChart
            echarts={echarts}
            data={chartData}
            onLoading={showLoading}
            onEchartsReady={(echarts) => {
                console.log('ready', echarts)
            }}
    />
    )
}