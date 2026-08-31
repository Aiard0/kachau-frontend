const listeners: Array<() => void> = []

export function onProductsReload(callback: () => void) {
  listeners.push(callback)
  return () => {
    const index = listeners.indexOf(callback)
    if (index > -1) listeners.splice(index, 1)
  }
}

export function triggerProductsReload() {
  listeners.forEach((cb) => cb())
}
