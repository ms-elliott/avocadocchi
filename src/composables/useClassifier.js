import * as tf from '@tensorflow/tfjs'
import { ref } from 'vue'

let model = null

export function useClassifier() {
  const loading = ref(false)

  const loadModel = async () => {
    if (!model) {
      model = await tf.loadLayersModel('/model/model.json')
    }
  }

  const preprocess = async (file) => {
    const img = new Image()
    img.src = URL.createObjectURL(file)

    await new Promise((resolve) => {
      img.onload = resolve
    })

    let tensor = tf.browser
      .fromPixels(img)
      .resizeNearestNeighbor([100, 100])
      .toFloat()
      .div(255.0)
      .expandDims()

    return tensor
  }

  const predict = async (file) => {
    loading.value = true

    await loadModel()

    const tensor = await preprocess(file)

    const prediction = model.predict(tensor)
    const score = prediction.dataSync()[0]

    loading.value = false

    return {
      isRipe: score > 0.5,
      confidence: Math.round(score * 100),
    }
  }

  return { predict, loading }
}
