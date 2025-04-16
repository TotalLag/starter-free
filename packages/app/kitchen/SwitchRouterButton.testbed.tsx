import { SwitchRouterButton } from '@my/ui'
import { ComponentTestbed } from './ComponentTestbed'

export function SwitchRouterButtonTestbed() {
  return (
    <ComponentTestbed
      title="SwitchRouterButton"
      description="A button that switches between app and pages router modes"
      component={SwitchRouterButton}
      propControls={[
        {
          name: 'pagesMode',
          type: 'boolean',
          defaultValue: false,
          description: 'Whether to show pages mode or app mode',
        },
      ]}
      variants={[
        {
          name: 'App Router Mode',
          props: { pagesMode: false },
        },
        {
          name: 'Pages Router Mode',
          props: { pagesMode: true },
        },
      ]}
    />
  )
}
