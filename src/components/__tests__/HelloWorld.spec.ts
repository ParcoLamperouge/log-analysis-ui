import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HomeView from '../../views/HomeView.vue'

describe('HelloWorld', () => {
  it('renders properly', () => {
    const wrapper = mount(HomeView, { props: {} })
    expect(wrapper.text()).toContain('拖拽日志文件到此处')
  })
})
