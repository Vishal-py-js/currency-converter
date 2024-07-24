import React, { useState } from 'react'
import "./Dropdown.css"


function Dropdown({data, setData}) {
    const[selected, setSelected] = useState(null)
    const handleChange = (input) => {
        setData(input)
        setSelected(input)
    }
    return (
        <>
            <li className="dropdown dropdown-1">
                <span className='selector'>
                    <h4>{selected?selected:"Select"}</h4>
                    <img className='icon' src="assets/icons/dropdown.svg"/>
                </span>
                <ul className="dropdown_menu dropdown_menu-1">
                    <li 
                        onClick={() => {
                            setData(null)
                            setSelected(null)
                        }} 
                        className={"dropdown_item-1"}>
                        UNSELECT
                    </li>
                    {
                        data?data.map((item, index)=> (
                            <li onClick={() => handleChange(item)} key={index} className={selected&&selected===item?'selected dropdown_item-1':"dropdown_item-1"}>{item}</li>
                        ))
                        :null
                    }
                   
                </ul>
            </li>
        </>
    )
}

export default Dropdown