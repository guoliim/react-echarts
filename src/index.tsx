import * as React from 'react'
import * as echarts from 'echarts'
import equal from 'fast-deep-equal'

import { addResizeListener, removeResizeListener } from './helper'

export type SetOptsType = {
    notMerge?: boolean,
    lazyUpdate?: boolean,
    silent?: boolean,
}

export type OnType = {
    event: string,
    handler: (params: unknown) => unknown,
}

export type DataType = {
    option: object,
    opts?: SetOptsType,
    on?: OnType[],
}

export type InitialOptsType = {
    devicePixelRatio?: number,
    renderer?: string,
    width?: number|string,
    height?: number|string
}

export type ChartProps = {
    className?: string,
    data: DataType,
    opts?: InitialOptsType,
    theme?: object | string,
    disableLoading?: boolean,
    onLoading?: (echarts: echarts.Echarts) => unknown,
    onEchartsReady?: (echarts: echarts.Echarts) => unknown,
}

const Chart = ({
    className,
    data,
    opts,
    theme,
    disableLoading = false,
    onLoading,
    onEchartsReady,
}: ChartProps) => {

    const isDidMount = React.useRef(false)
    const prevValue = React.useRef<ChartProps | undefined>()

    const element = React.useRef<HTMLDivElement>(null)
    const chartElement = React.useRef<echarts.Echarts>(null)

    const initialEchartDom = React.useCallback((opts?: InitialOptsType, theme?: object | string) => {
        if (!!chartElement.current) {
            chartElement.current.dispose()
        }

        chartElement.current = echarts.init(
            element.current,
            theme,
            {
                ...{ renderer: 'svg' },
                ...opts,
            }
        )
    }, [])

    const setOptionHelper = React.useCallback((
        option: object,
        opts?: SetOptsType,
        disableLoading?: boolean,
        onLoading?: (echarts: echarts.Echarts) => unknown,
    ) => {
        if (!!chartElement.current) {
            if (!!option) {
                chartElement.current.setOption(
                    option, 
                    {
                        ...{ lazyUpdate: true },
                        ...opts,
                    }
                )
                
                if (disableLoading === true) {
                    chartElement.current.hideLoading()
                }

                if (disableLoading === false && disableLoading === undefined) {
                    if (typeof onLoading === 'function') {
                        onLoading(chartElement.current)
                    }
                }
            }

            return chartElement.current
        }
    }, [])

    const bindEventHandler = React.useCallback((on: OnType[]) => {
        if (on && on.length !== 0 && chartElement.current) {
            on.map(({ event, handler }) => {
                chartElement.current.on(event, handler)
            })
        }
    }, [])

    React.useEffect(() => {
        // did mount
            
        initialEchartDom(opts, theme)
        data?.option && setOptionHelper(
            data.option,
            data.opts,
            disableLoading,
            onLoading,
        )
        data?.on && bindEventHandler(data.on)
        addResizeListener(element.current, () => (chartElement.current.resize()))

        if (typeof onEchartsReady === 'function') {
            onEchartsReady(chartElement.current)
        }

        return () => {
            // will un mount

            removeResizeListener(element.current, () => (chartElement.current.resize()))
    
            chartElement.current.dispose()
            chartElement.current = null
            prevValue.current = undefined
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    React.useEffect(() => {
        if (!!isDidMount.current && !!prevValue.current?.data && !!data) {
            // did update

            if (!equal(prevValue.current.data.option, data.option) 
                && equal(prevValue.current.data.on, data.on)
                && equal(prevValue.current.opts, opts)
            ) {
                chartElement.current.hideLoading()
                setOptionHelper(
                    data.option,
                    data.opts,
                    disableLoading,
                    onLoading,
                )

                if (typeof onEchartsReady === 'function') {
                    onEchartsReady(chartElement.current)
                }
            }

            if (
                !equal(prevValue.current.data.on, data.on) || 
                !equal(prevValue.current.opts, opts) ||
                !equal(prevValue.current.theme, theme)
                ) {
                initialEchartDom(opts, theme)
                setOptionHelper(
                    data.option,
                    data.opts,
                    disableLoading,
                    onLoading,
                )
                data?.on && bindEventHandler(data.on)

                if (typeof onEchartsReady === 'function') {
                    onEchartsReady(chartElement.current)
                }
            }
        }
    }, [
        bindEventHandler, 
        data,
        disableLoading,
        initialEchartDom,
        onLoading, opts,
        setOptionHelper,
        theme,
        onEchartsReady,
    ])

    React.useEffect(() => {
        isDidMount.current = true

        return () => {
            isDidMount.current = false
        }
    }, [])

    React.useEffect(() => {
        prevValue.current = { data, opts, theme }
    })

    return (
        <div className={`react-echarts-container ${className}`} ref={element} />
    )
}

export default React.memo(Chart, (prevValue, nextValue) => (equal(prevValue, nextValue)))