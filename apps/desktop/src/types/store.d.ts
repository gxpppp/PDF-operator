import type { Pinia } from 'pinia'
import type { Router } from 'vue-router'
import type { I18n } from 'vue-i18n'

declare module 'vue' {
  interface ComponentCustomProperties {
    $pinia: Pinia
    $router: Router
    $route: Router['currentRoute']['value']
    $i18n: I18n
    $t: I18n['global']['t']
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $pinia: Pinia
    $router: Router
    $route: Router['currentRoute']['value']
    $i18n: I18n
    $t: I18n['global']['t']
  }
}
