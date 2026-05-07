import { globalExperts01Slider } from './globalExperts01Slider';
import { globalResources01Slider } from './globalResources01Slider';
import { sqlR2RSlider01 } from './globalSqlr2rSlider01';
import { toolkitSlider01 } from './globalToolkitSlider01';
import { inCardExpertsSlider } from './incardExpertsSlider';

export function indexSliders() {
  function initAllSliders() {
    sqlR2RSlider01();
    toolkitSlider01();
    inCardExpertsSlider();
    globalResources01Slider();
    globalExperts01Slider();
  }

  return { initAllSliders };
}
