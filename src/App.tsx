import './App.css'
import { getNewsData, NewsData } from './newsdata'
import { useState, useEffect } from 'react'

interface QueryParams {
  query: string,
  from: string,
  to: string
}

function App() {
  const [data, setData] = useState<(NewsData | undefined)>(undefined)
  const [queryParams, setQueryParams] = useState<QueryParams>({query: "semiconductor stocks", from: "2024-09-16", to: "2024-09-17"})

  useEffect(() => {
    const fetchNewsData = async () => {
      const {query, from, to} = queryParams
      const newsData = await getNewsData(query, from, to)
      setData(newsData)
    }
    fetchNewsData()
  }, [queryParams])

  const handleClick = () => {
    const query = (document.getElementById("search-input") as HTMLInputElement).value
    const from = (document.getElementById("from-input") as HTMLInputElement).value
    const to = (document.getElementById("to-input") as HTMLInputElement).value
    setQueryParams({query, from, to})
  }

  return (
    <div className="container">
      <div className="row mb-4 mt-5">
        <h3 className="text-center">The average sentiment across {data?.totalResults || ""} articles is:</h3>
        <h1 className="big-text text-center">{data?.averageSentiment.toFixed(3) || "Loading..."}</h1>
      </div>
      <div className="row mb-4">
        <div className="col-5">
          <input type="text" className="form-control" id="search-input" placeholder="Search Term: semiconductor stocks"/>
        </div>
        <div className="col-3">
          <input type="text" className="form-control" id="from-input" placeholder="From: 2024-09-16"/>
        </div>
        <div className="col-3">
          <input type="text" className="form-control" id="to-input" placeholder="To: 2024-09-17"/>
        </div>
        <div className="col-1">
          <button onClick={handleClick} className="btn btn-primary">Go!</button>
        </div>
      </div>
      <div className="row mb-4">
        <h3>Here are the five most positive articles:</h3>
        <ul className="list-group">
          <li className="list-group-item">{data?.topFiveItems[0].url || ""}</li>
          <li className="list-group-item">{data?.topFiveItems[1].url || ""}</li>
          <li className="list-group-item">{data?.topFiveItems[2].url || ""}</li>
          <li className="list-group-item">{data?.topFiveItems[3].url || ""}</li>
          <li className="list-group-item">{data?.topFiveItems[4].url || ""}</li>
        </ul>
      </div>
      <div className="row mb-4">
        <h3>Here are the five most negative articles:</h3>
        <ul className="list-group">
          <li className="list-group-item">{data?.bottomFiveItems[0].url || ""}</li>
          <li className="list-group-item">{data?.bottomFiveItems[1].url || ""}</li>
          <li className="list-group-item">{data?.bottomFiveItems[2].url || ""}</li>
          <li className="list-group-item">{data?.bottomFiveItems[3].url || ""}</li>
          <li className="list-group-item">{data?.bottomFiveItems[4].url || ""}</li>
        </ul>
      </div>
      
    </div>
  )
}

export default App
