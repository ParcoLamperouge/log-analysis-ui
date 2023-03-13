import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import DropView from '../../views/DropView.vue'

describe('HelloWorld', () => {
  it('renders properly', () => {
    const wrapper = mount(DropView, { props: {} })
    expect(wrapper.text()).toContain('拖拽日志文件到此处')
  })
})
