import React, { useRef, useState } from "react"
import { Camera } from "react-cam"
import axios from "axios"
import styles from "../../css/main.module.scss"
import { graphql } from "gatsby"
import { VictoryPie, VictoryLabel } from "victory"

const cameraButton = (
  <svg
    width="100%"
    height="100"
    viewBox="0 0 31 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse cx="15.5" cy="15" rx="15.5" ry="15" fill="#07CF07" />
    <path
      d="M7.52917 24.241L11.8885 16.992L17.7948 26.798C17.051 26.931 16.2844 27 15.5 27C12.4719 27 9.69271 25.964 7.52917 24.241V24.241ZM27.2896 18.994C26.0583 22.339 23.325 25.006 19.8687 26.246L15.5073 18.994H27.2896ZM11.8875 12.994L5.99583 22.791C4.12812 20.694 3 17.972 3 15C3 14.316 3.05937 13.646 3.17396 12.994H11.8875ZM24.9948 7.199C26.8677 9.297 28 12.023 28 15C28 15.679 27.9406 16.345 27.8281 16.994H19.1062L24.9948 7.199V7.199ZM13.2188 3.2C13.9583 3.069 14.7208 3 15.5 3C18.524 3 21.2979 4.033 23.4604 5.751L19.1062 12.991L13.2188 3.2V3.2ZM15.5 10.994H3.71458C4.95 7.65 7.68542 4.986 11.1437 3.75L15.5 10.994Z"
      fill="white"
    />
  </svg>
)

const backendAPI = axios.create({
  baseURL: "https://hc2020ecoscan.azurewebsites.net",
  headers: { "Content-Type": "application/json" },
})

const useCaptureImage = initState => {
  const [imagesData, setimagesData] = useState(initState)
  const callAPI = imgSrc =>
    backendAPI
      .post("/", JSON.stringify(imgSrc))
      .then(res => {
        console.log(imgSrc)
        setimagesData([
          ...imagesData,
          {
            object: res.data.object,
            probability: res.data.probability,
          },
        ])
      })
      .catch(err => {
        console.log(imgSrc)
      })
  return [imagesData, callAPI]
}

function imageToCarbonFootPrint(imageData, allcarbonFootprintData) {
  return allcarbonFootprintData.filter(
    carbonFootprintData => carbonFootprintData.node.food === imageData.object
  )[0].node
}

const IndexPage = ({ data }) => {
  const [imagesData, captureImage] = useCaptureImage([
    { object: "banana", probability: 0.988 },
  ])
  const allcarbonFootprintData = data.allFoodCarbonFootprintJson.edges

  const carbonFootprintData = imagesData.map(imageData =>
    imageToCarbonFootPrint(imageData, allcarbonFootprintData)
  )

  const pieChartData = carbonFootprintData.map(data => ({
    x: data.food,
    y: data.carbonOutput,
  }))
  const cam = useRef(null)
  return (
    <div className={styles.mainWrapper}>
      <div className={styles.camera}>
        <div className={styles.heading}>
          <h1>EcoScan</h1>
        </div>
        <div className={styles.cameraWindow}>
          {typeof window !== `undefined` ? (
            <Camera
              showFocus={true}
              front={false}
              capture={captureImage}
              ref={cam}
              width="800px"
              height="500px"
              btnColor="rgb(0,0,0,1)"
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
      </div>
      <div className={styles.mainPieStat}>
        <div className={styles.pieChart}>
          <VictoryPie
            colorScale="qualitative"
            data={pieChartData}
            labelComponent={<VictoryLabel renderInPortal />}
          />
        </div>
        <div>
          <h2 className={styles.mainPieHeading}> Total Carbon Footprint </h2>
          <div>
            <div className={styles.mainPieNumber}>
              {carbonFootprintData.reduce(
                (acc, curr) => acc + parseFloat(curr.carbonOutput),
                0
              )}
            </div>
            <div className={styles.mainPieText}>kg CO2e / kg</div>
          </div>
        </div>
      </div>
      <div>
        {carbonFootprintData.map((data, index) => (
          <div className={styles.mainPieStat}>
            <div className={styles.foodMainDeal}>
              <h2 className={styles.mainPieHeading}>{data.food}</h2>
              <div className={styles.mainPieNumber}>{data.carbonOutput}</div>
              <div className={styles.mainPieText}>kg CO2e / kg</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default IndexPage
export const query = graphql`
  query {
    allFoodCarbonFootprintJson {
      edges {
        node {
          category
          food
          carbonOutput
          attributes {
            item
            quantity
            units
          }
        }
      }
    }
  }
`
