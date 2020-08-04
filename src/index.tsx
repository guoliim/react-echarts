import React from "react"
import equal from "fast-deep-equal"

import { addResizeListener, removeResizeListener } from "./helper"
import { EChartsOptionConfig, EChartOption, ECharts } from "echarts"

export type OnType = {
    event: string
    handler: (params: unknown) => unknown
}

export type DataType = {
    option: Record<string, unknown>
    opts?: EChartsOptionConfig
    on?: OnType[]
}

export type InitialOptsType = {
    devicePixelRatio?: number
    renderer?: string
    width?: number | string
    height?: number | string
}

export type ChartProps = {
    echarts: typeof echarts
    className?: string
    data: DataType
    opts?: InitialOptsType
    theme?: Record<string, unknown>
    disableLoading?: boolean
    onLoading?: (echarts: ECharts) => unknown
    onEchartsReady?: (echarts: ECharts) => unknown
}

const Chart = ({
    echarts,
    className,
    data,
    opts,
    theme,
    disableLoading = false,
    onLoading,
    onEchartsReady,
}: ChartProps) => {
    const isDidMount = React.useRef(false)
    const prevValue = React.useRef<
        | {
              data: DataType
              opts?: InitialOptsType
              theme?: Record<string, unknown>
          }
        | undefined
    >()

    const element = React.useRef<HTMLDivElement | null>(null)
    const chartElement = React.useRef<ECharts | null>(null)

    const initialEchartDom = React.useCallback((opts?: InitialOptsType, theme?: Record<string, unknown>) => {
        if (!!chartElement.current) {
            chartElement.current.dispose()
        }

        if (element.current) {
            chartElement.current = echarts.init(element.current, theme, {
                ...{ renderer: "svg" },
                ...opts,
            })
        }
    }, [])

    const setOptionHelper = React.useCallback(
        (
            option: EChartOption,
            opts?: EChartsOptionConfig,
            disableLoading?: boolean,
            onLoading?: (echarts: ECharts) => unknown,
        ) => {
            if (!!chartElement.current) {
                if (!!option) {
                    chartElement.current.setOption(option, {
                        ...{ lazyUpdate: true },
                        ...opts,
                    })

                    if (disableLoading === true) {
                        chartElement.current.hideLoading()
                    }

                    if (disableLoading === false && disableLoading === undefined) {
                        if (typeof onLoading === "function") {
                            onLoading(chartElement.current)
                        }
                    }
                }

                return chartElement.current
            }
        },
        [],
    )

    const bindEventHandler = React.useCallback((on: OnType[]) => {
        if (on && on.length !== 0) {
            on.map(({ event, handler }) => {
                chartElement.current && chartElement.current.on(event, handler)
            })
        }
    }, [])

    React.useEffect(() => {
        // did mount

        initialEchartDom(opts, theme)

        if (chartElement.current) {
            data?.option && setOptionHelper(data.option, data.opts, disableLoading, onLoading)
            data?.on && bindEventHandler(data.on)
            addResizeListener(element.current, () => chartElement.current?.resize())

            if (typeof onEchartsReady === "function") {
                onEchartsReady(chartElement.current)
            }
        }

        return () => {
            // will un mount

            if (chartElement.current) {
                removeResizeListener(element.current, () => chartElement.current?.resize())

                chartElement.current.dispose()
                chartElement.current = null
                prevValue.current = undefined
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    React.useEffect(() => {
        if (!!chartElement.current && !!isDidMount.current && !!prevValue.current?.data && !!data) {
            // did update

            if (
                !equal(prevValue.current.data.option, data.option) &&
                equal(prevValue.current.data.on, data.on) &&
                equal(prevValue.current.opts, opts)
            ) {
                chartElement.current.hideLoading()
                setOptionHelper(data.option, data.opts, disableLoading, onLoading)

                if (typeof onEchartsReady === "function") {
                    onEchartsReady(chartElement.current)
                }
            }

            if (
                !equal(prevValue.current.data.on, data.on) ||
                !equal(prevValue.current.opts, opts) ||
                !equal(prevValue.current.theme, theme)
            ) {
                initialEchartDom(opts, theme)
                setOptionHelper(data.option, data.opts, disableLoading, onLoading)
                data?.on && bindEventHandler(data.on)

                if (typeof onEchartsReady === "function") {
                    onEchartsReady(chartElement.current)
                }
            }
        }
    }, [
        bindEventHandler,
        data,
        disableLoading,
        initialEchartDom,
        onLoading,
        opts,
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

    return <div className={`react-echarts-container ${className}`} ref={element} />
}

export default React.memo(Chart, (prevValue, nextValue) => equal(prevValue, nextValue))