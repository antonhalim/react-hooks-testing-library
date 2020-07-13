import flushMicroTasks from './flush-microtasks'

let cleanupCallbacks = []

async function cleanup() {
  await flushMicroTasks()
  cleanupCallbacks.forEach((cb) => cb())
  cleanupCallbacks = []
}

function addCleanup(callback) {
  cleanupCallbacks.push(callback)
}

function removeCleanup(callback) {
  cleanupCallbacks = cleanupCallbacks.filter((cb) => cb !== callback)
}

cleanup.autoRegister = function () {
  // Automatically registers cleanup in supported testing frameworks
  if (typeof afterEach === 'function' && !process.env.RHTL_SKIP_AUTO_CLEANUP) {
    afterEach(async () => {
      await cleanup()
    })
  }
}

export { cleanup, addCleanup, removeCleanup }