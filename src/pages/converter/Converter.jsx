import React, { useEffect, useState } from 'react'
import "./Converter.css"
import Dropdown from '../../components/dropdown/Dropdown'
import axios from 'axios'
import Graph from '../../components/graph/graph'

function Converter() {
  const [currencies, setCurrencies] = useState([])
  const [source, setSource] = useState("")
  const [target, setTarget] = useState("")
  const [amount, setAmount] = useState(1)
  const [date, setDate] = useState(null)
  const [result, setResult] = useState(null)

  const [year, setYear] = useState(null)
  const [month, setMonth] = useState(null)
  const [day, setDay] = useState(null)
  const [historyData, setHistoryData] = useState(null)
  const [graphData, setGraphData] = useState(null)

  const getCurrencies = async() => {
    const data = await axios.get(`https://v6.exchangerate-api.com/v6/${import.meta.env.VITE_API_KEY}/latest/USD`)
    setCurrencies(Object.keys(data.data.conversion_rates))
  }

  const handleAmount = (e) => {
    setAmount(e.target.value)
  }

  const handleDate = (e) => {
    setDate(e.target.value)
    let dta = e.target.value.split("-")
    setYear(dta[0])
    setMonth(dta[1].replace("0",""))
    setDay(dta[2].replace("0",""))
  }

  const getPairConversion = async() => {
    const res = await axios.get(`https://v6.exchangerate-api.com/v6/${import.meta.env.VITE_API_KEY}/pair/${source}/${target}/${amount}`)
    setResult({res: res.data.conversion_result, currency:res.data.target_code})
  }

  const getHistoryData = async() => {
    const res = await axios.get(`https://v6.exchangerate-api.com/v6/${import.meta.env.VITE_API_KEY}/history/${source}/${year}/${month}/${day}`)
    setHistoryData(res.data.conversion_rates)
  }

  const createGraphData = () => {
    if(historyData){
      let arr = []
      for (const [key, value] of Object.entries(historyData)){
        arr.push({name :key, value: value})
      }
      setGraphData(arr.slice(0, 24))
    }
  }

  useEffect(()=> {
    createGraphData()
  }, [historyData])

  const apiReq = () => {
    if(date && source){
      getHistoryData()

    } else if(date==null && target && source){
      getPairConversion()
    } else {
      setError(true)
    }
  }

  useEffect(() => {
    getCurrencies()
  }, [])

  return (
    <div className='container'>
      <div className='wrapper'>
        <div className='converter'>
          <div className='selector-cont'>
            <strong>Source:</strong>
            <Dropdown data={currencies} setData={setSource}/>
          </div>
          <img className='arrows' src='assets/icons/arrows.svg'/>
          <div className='selector-cont'>
            <strong>Target:</strong>
            <Dropdown data={currencies}setData={setTarget}/>
          </div>
        </div>
        <div className='converter'>
          <div className='selector-cont'>
            <strong>Amount:</strong>
            <input className='amount' value={amount} onChange={(e)=>handleAmount(e)} type='number' placeholder='Enter amount'/>
          </div>
          <div className='selector-cont'>
            <strong>Date:</strong>
            <input className='amount' disabled={!target?false:true} value={date} onChange={(e)=>handleDate(e)} type='date' placeholder='Enter amount'/>
          </div>
        </div>
        <button onClick={apiReq} className='button'>CONVERT</button>
        {
          result?
          <div className='selector-cont'>
            <strong>Result:</strong>
            <input className='amount' disabled value={`${result.res.toFixed(2)} ${result.currency}`}/>
          </div>:""
        }
        {
          date && graphData?
          <div className='graph'>
            <Graph data1={graphData}/>
          </div>:""
        }
      </div>
    </div>
  )
}

export default Converter