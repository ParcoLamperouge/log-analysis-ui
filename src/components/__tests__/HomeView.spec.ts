import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils';
import HomeView from '../HomeView.vue';

describe('HomeView', () => {
  it('renders properly', () => {
    const wrapper = mount(HomeView, { props: {} })
    expect(wrapper.text()).toContain('拖拽日志文件到此处')
  })
})
