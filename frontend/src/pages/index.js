import React, { useRef, useState } from "react"
import { Camera } from "react-cam"
import axios from "axios"

const useCaptureImage = initState => {
  const [carbonFootprintData, setCarbonFootPrintData] = useState(initState)
  const callAPI = imgSrc =>
    axios
      .post(
        "CHANGE THIS URL PLEASE",
        { "Content-Type": "application/json" },
        JSON.stringify(imgSrc)
      )
      .then(res =>
        setCarbonFootPrintData([
          ...carbonFootprintData,
          {
            object: res.object,
            probability: res.probability,
          },
        ])
      )

  return [carbonFootprintData, callAPI]
}

const IndexPage = () => {
  const [carbonFootprintData, captureImage] = useCaptureImage([
    { object: "banana", probability: 0.988 },
  ])

  const cam = useRef(null)
  return (
    <>
      <h1>Eco Scan</h1>
      {typeof window !== `undefined` ? (
        <Camera
          showFocus={true}
          front={false}
          capture={captureImage}
          ref={cam}
          width="80%"
          height="auto"
          focusWidth="80%"
          focusHeight="60%"
          btnColor="white"
        />
      ) : null}
      <button onClick={img => cam.current.capture(img)}>Take image</button>
      {carbonFootprintData.map(data => (
        <div>
          <span> {data.object}</span>
          <span> {data.probability}</span>
        </div>
      ))}
    </>
  )
}

export default IndexPage
