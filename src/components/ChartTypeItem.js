import React from 'react'

const ChartTypeItem = ({ element, activeChartTypeHandler, activeChartType }) => {
    return <div
        onClick={() => activeChartTypeHandler(element)}
        className={`chart-type__item ${activeChartType.id === element.id && 'active'}`}>
        {element.name}
    </div>
}

export default ChartTypeItem
