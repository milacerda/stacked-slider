/* eslint-disable import/no-webpack-loader-syntax */
import { getService } from 'vc-cake'
import StackedSlider from './component'

const vcvAddElement = getService('cook').add

vcvAddElement(
  require('./settings.json'),
  // Component callback
  (component) => {
    component.add(StackedSlider)
  },
  // css settings // css for element
  {
    'css': require('raw-loader!./styles.css'),
    'editorCss': require('raw-loader!./editor.css'),
    'mixins': {
      'arrowColor': {
        'mixin': require('raw-loader!./cssMixins/arrowColor.pcss')
      },
      'arrowColorHover': {
        'mixin': require('raw-loader!./cssMixins/arrowColorHover.pcss')
      },
      'imageOverlay': {
        'mixin': require('raw-loader!./cssMixins/imageOverlay.pcss')
      },
      'imageOverlayHover': {
        'mixin': require('raw-loader!./cssMixins/imageOverlayHover.pcss')
      }
    }
  }
)
