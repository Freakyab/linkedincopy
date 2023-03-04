import React, { useEffect } from 'react'

const index = (props) => {
    console.log(props)
    const getInitialProps = async () => {
        const res = await fetch('https://api.github.com/repos/zeit/next.js')
        const json = await res.json()
        console.log(json)
        return { stars: json.stargazers_count }
    }
    React.useEffect(() => {
        getInitialProps()
    }, [])

  return (
    <div>index</div>
  )
}

export default index