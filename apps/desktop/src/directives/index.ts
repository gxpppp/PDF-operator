export { clickOutside } from './clickOutside'
export { drag } from './drag'
export { drop } from './drop'
export { focus } from './focus'
export { lazy } from './lazy'
export { loading } from './loading'
export { permission, setPermissions } from './permission'
export { tooltip } from './tooltip'

import type { App } from 'vue'
import { clickOutside } from './clickOutside'
import { drag } from './drag'
import { drop } from './drop'
import { focus } from './focus'
import { lazy } from './lazy'
import { loading } from './loading'
import { permission } from './permission'
import { tooltip } from './tooltip'

export const setupDirectives = (app: App) => {
  app.directive('click-outside', clickOutside)
  app.directive('drag', drag)
  app.directive('drop', drop)
  app.directive('focus', focus)
  app.directive('lazy', lazy)
  app.directive('loading', loading)
  app.directive('permission', permission)
  app.directive('tooltip', tooltip)
}

export default setupDirectives
