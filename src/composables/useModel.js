// useModel.js
import * as tf from '@tensorflow/tfjs'
import { ref } from 'vue'

let model = null // ✅ refではなく普通の変数
const modelLoading = ref(true)
const modelError = ref(null)

export function useModel() {
  async function loadModel() {
    try {
      await tf.setBackend('webgl')
      await tf.ready()
      model = await tf.loadGraphModel('/model/model.json')
      console.log('model loaded')
    } catch (e) {
      modelError.value = e.message
      console.error(e)
    } finally {
      modelLoading.value = false
    }
  }

  function getModel() {
    return model
  }

  return { modelLoading, modelError, loadModel, getModel }
}
