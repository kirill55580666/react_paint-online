import React from 'react';
import toolState from "../store/toolState";
import useDebounce from "../hooks/useDebounce";

const SettingBar = () => {

    const changeStrokeColor = useDebounce( (e) => {
        if(toolState.tool) {
            //toolState.setFillColor(e.target.value);
            toolState.setStrokeColor(e.target.value);
        }
    }, 100)

    return (
        <div className="setting-bar">
            <label
                style={{margin: '0 0 0 10px'}}
                htmlFor="line-width"
            >
                Толщина линии
            </label>
            <input
                onChange={e => toolState.setLineWidth(e.target.value)}
                style={{margin: '0 10px'}}
                id='line-width'
                type='number'
                min={1}
                max={50}
                defaultValue={1}
            />
            <label
                style={{margin: '0 0 0 5px'}}
                htmlFor="stroke-color"
            >
                Цвет обводки
            </label>
            <input
                onChange={e => changeStrokeColor(e)}
                style={{margin: '0 10px'}}
                id='stroke-color'
                type='color'
                min={1}
                max={50}
                defaultValue={1}
            />
        </div>
    );
};

export default SettingBar;