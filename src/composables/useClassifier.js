import * as tf from '@tensorflow/tfjs'

let model = null

export const loadModel = async () => {
  model = await tf.loadLayersModel('/model/model.json')
}

export const predict = async (imageElement) => {
  const tensor = tf.browser
    .fromPixels(imageElement)
    .resizeNearestNeighbor([100, 100])
    .toFloat()
    .div(255.0)
    .expandDims()

  const prediction = await model.predict(tensor).data()

  return prediction
}
