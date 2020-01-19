import React, { useRef, useState } from "react"
import { Camera } from "react-cam"
import axios from "axios"
import styles from "../../css/main.module.scss"

const cameraButton = (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4.348 21.241l4.185-7.249 5.67 9.806c-.714.133-1.45.202-2.203.202-2.907 0-5.575-1.036-7.652-2.759zm18.97-5.247c-1.182 3.345-3.806 6.012-7.124 7.252l-4.187-7.252h11.311zm-14.786-6l-5.656 9.797c-1.793-2.097-2.876-4.819-2.876-7.791 0-.684.057-1.354.167-2.006h8.365zm12.583-5.795c1.798 2.098 2.885 4.824 2.885 7.801 0 .679-.057 1.345-.165 1.994h-8.373l5.653-9.795zm-11.305-3.999c.71-.131 1.442-.2 2.19-.2 2.903 0 5.566 1.033 7.642 2.751l-4.18 7.24-5.652-9.791zm2.19 7.794h-11.314c1.186-3.344 3.812-6.008 7.132-7.244l4.182 7.244z" />
  </svg>
)

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
    <div className={styles.mainWrapper}>
      <div className={styles.heading}>
        <h1>Eco Scan</h1>
      </div>
      <div className={styles.camera}>
        {typeof window !== `undefined` ? (
          <Camera
            showFocus={true}
            front={false}
            capture={captureImage}
            ref={cam}
            width="auto"
            height="80%"
            btnColor="white"
            focusHeight="55%"
            focusWidth="80%"
          />
        ) : null}
      </div>
      <div>
        <div className={styles.button}>
          <button onClick={img => cam.current.capture(img)}>
            {cameraButton}
          </button>
        </div>
      </div>
      {carbonFootprintData.map(data => (
        <div>
          <span> {data.object}</span>
          <span> {data.probability}</span>
        </div>
      ))}
    </div>
  )
}

export default IndexPage
