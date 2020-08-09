# react-echarts
a react wrapper component for echarts which steal ideal from [echarts-for-react](https://github.com/hustcc/echarts-for-react) by react hook & typescript.

# Install

use `npm`

`npm install @guoliim/react-echarts`

use `yarn`

`yarn add @guoliim/react-echarts`

### Usage

```javascript
import React from 'react'
import echarts from 'echarts'
import Charts from '@guoliim/react-echarts'

<Chart
    echarts={echarts}
    data={
        option, /* option to render in echarts */
    }
/>

```

# API

## echarts

+ description

    ***Required***, echarts module include version 3.x or 4.x

+ type

    --

+ example

    `echarts`

## className

+ description

    ***Optional***, css class name to style charts, especially block-size

+ type

    string

+ example

    classNameToStyleChart

## data

+ description

    ***Required***, include three part

    - option: required, data & params that echarts to be merged to generate and render in chart

    - opts: optional, include `notMerge`, `lazyUpdate`, `silent` to modify echarts instance merge & update & silent behavior

    - on: optional, bind event on echarts instance

    mode detail can be found in [official doc](https://echarts.apache.org/en/api.html#echartsInstance.setOption)

+ type

    ```typescript
        {
            data: Object,
            opts?: {
                notMerge?: boolean,
                lazyUpdate?: boolean,
                silent?: boolean
            },
            on?: {
                event: string
                handler: (params: unknown) => unknown
            }[]
        }
    ```

+ default / example

    - default: lazyUpdate value is true

    - example:

        ```typescript
            {
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
        ```

## opts

+ description

    ***Optional***, option to modify init echarts instance

+ type

    ```typescript
        {
            devicePixelRatio?: number
            renderer?: string
            width?: number | string
            height?: number | string
        }
    ```

+ default / example

    - default: `{ rerender: 'svg' }`

    - example: 

        ```typescript
            {
                devicePixelRatio: 15,
                renderer: 'canvas',
                width: 300,
                height: 300,
            }
        ```

## theme

+ description

    ***Optional***, Theme to be applied. This can be a configuring object of a theme, or a theme name registered through echarts.registerTheme.

+ type

    `Object`

+ example

    --

## disableLoading

+ description 

    ***Optional***, when echarts loading, show the loading mask

+ type

    `boolean`

+ example

    `false`

## onLoading

+ description 

    ***Optional***, then function to set how the loading mask showing

+ type

    `(echarts: ECharts) => unknown`

+ example

    ```typescript
        const showLoading = (chart) => {
            chart.clear()
            chart.showLoading({
                text: '努力加载中',
                color: '#333',
                textColor: '#333',
                maskColor: 'transparent'
            })
        }
    ```

## onEchartsReady

+ description

    ***Optional***, the handle when echarts instance settled successfully

+ type

    `(echarts: ECharts) => unknown`

+ example

    ```typescript
        (echarts) => {
            console.log('ready', echarts)
        }
    ```

# Echarts API

echarts option & params & api can found in [official doc](https://echarts.apache.org/en/cheat-sheet.html)

# Example

```typescript
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
```

# RoadMap

# License
MIT@[guoliim](https://github.com/guoliim)

### To-do
1. - [x] add types/index.d.ts support
2. - [x] add eslint / typescript lint
3. - [x] add prettier
4. - [x] add test
5. - [x] add doc
6. - [x] add example for local
7. - [ ] add example for online
8. - [ ] add publish script for npm registry & github pkg registry
9. - [ ] promote test coverage
