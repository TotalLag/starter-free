import { useState } from 'react'
import {
  XStack,
  YStack,
  H1,
  H2,
  Paragraph,
  Separator,
  Button,
  Switch,
  Input,
  Select,
  Text,
} from '@my/ui'

interface PropControl {
  name: string
  type: 'boolean' | 'string' | 'number' | 'select'
  defaultValue: any
  options?: string[] // For select type
  description?: string
}

interface ComponentTestbedProps {
  title: string
  description?: string
  component: React.ComponentType<any>
  propControls?: PropControl[]
  defaultProps?: Record<string, any>
  variants?: Array<{
    name: string
    props: Record<string, any>
  }>
  showCode?: boolean
}

export function ComponentTestbed({
  title,
  description,
  component: Component,
  propControls = [],
  defaultProps = {},
  variants = [],
  showCode = true,
}: ComponentTestbedProps) {
  const [props, setProps] = useState({ ...defaultProps })
  const [viewportWidth, setViewportWidth] = useState('100%')
  const [darkMode, setDarkMode] = useState(false)

  const updateProp = (name: string, value: any) => {
    setProps((prev) => ({ ...prev, [name]: value }))
  }

  const renderPropControl = (control: PropControl) => {
    const { name, type, defaultValue, options, description } = control

    switch (type) {
      case 'boolean':
        return (
          <XStack key={name} justify="center" gap="$2">
            <Text>{name}</Text>
            <Switch
              checked={props[name] ?? defaultValue}
              onCheckedChange={(checked) => updateProp(name, checked)}
            />
            {description && (
              <Text fontSize="$1" color="$color10">
                {description}
              </Text>
            )}
          </XStack>
        )

      case 'string':
        return (
          <YStack key={name} gap="$1">
            <Text>{name}</Text>
            <Input
              value={props[name] ?? defaultValue}
              onChangeText={(text) => updateProp(name, text)}
              placeholder={`Enter ${name}`}
            />
            {description && (
              <Text fontSize="$1" color="$color10">
                {description}
              </Text>
            )}
          </YStack>
        )

      case 'number':
        return (
          <YStack key={name} gap="$1">
            <Text>{name}</Text>
            <Input
              value={String(props[name] ?? defaultValue)}
              onChangeText={(text) => updateProp(name, Number(text))}
              keyboardType="numeric"
              placeholder={`Enter ${name}`}
            />
            {description && (
              <Text fontSize="$1" color="$color10">
                {description}
              </Text>
            )}
          </YStack>
        )

      case 'select':
        return (
          <YStack key={name} gap="$1">
            <Text>{name}</Text>
            <Select
              value={props[name] ?? defaultValue}
              onValueChange={(value) => updateProp(name, value)}
            >
              <Select.Trigger>
                <Select.Value placeholder={`Select ${name}...`} />
              </Select.Trigger>
              <Select.Content>
                <Select.ScrollUpButton />
                <Select.Viewport>
                  {(options || []).map((option, index) => (
                    <Select.Item key={option} value={option} index={index}>
                      <Select.ItemText>{option}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
                <Select.ScrollDownButton />
              </Select.Content>
            </Select>
            {description && (
              <Text fontSize="$1" color="$color10">
                {description}
              </Text>
            )}
          </YStack>
        )

      default:
        return null
    }
  }

  const renderPropsCode = () => {
    const propsString = Object.entries(props)
      .map(([key, value]) => {
        if (typeof value === 'string') return `${key}="${value}"`
        return `${key}={${JSON.stringify(value)}}`
      })
      .join(' ')

    return `<${Component.displayName || 'Component'} ${propsString} />`
  }

  const viewportOptions = [
    { label: 'Mobile (320px)', value: '320px' },
    { label: 'Tablet (768px)', value: '768px' },
    { label: 'Desktop (1024px)', value: '1024px' },
    { label: 'Full Width', value: '100%' },
  ]

  return (
    <YStack
      p="$4"
      gap="$4"
      bg={darkMode ? '$color1' : '$color2'}
      className={darkMode ? 'dark' : 'light'}
    >
      <YStack gap="$2">
        <H1>{title}</H1>
        {description && <Paragraph color="$color10">{description}</Paragraph>}
      </YStack>

      <XStack gap="$4" flexWrap="wrap">
        <Button variant={darkMode ? 'outlined' : undefined} onPress={() => setDarkMode(!darkMode)}>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </Button>

        <Select value={viewportWidth} onValueChange={setViewportWidth}>
          <Select.Trigger>
            <Select.Value placeholder="Select viewport width" />
          </Select.Trigger>
          <Select.Content>
            <Select.ScrollUpButton />
            <Select.Viewport>
              {viewportOptions.map((option, index) => (
                <Select.Item key={option.value} value={option.value} index={index}>
                  <Select.ItemText>{option.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
            <Select.ScrollDownButton />
          </Select.Content>
        </Select>
      </XStack>

      <Separator />

      {/* Controls Section */}
      {propControls.length > 0 && (
        <YStack gap="$4">
          <H2>Props</H2>
          <YStack gap="$2">{propControls.map(renderPropControl)}</YStack>
        </YStack>
      )}

      {/* Component Preview */}
      <YStack gap="$4">
        <H2>Preview</H2>
        <YStack
          borderWidth={1}
          borderColor="$color7"
          p="$4"
          borderRadius="$4"
          width={viewportWidth}
          minHeight={200}
          alignItems="center"
          justifyContent="center"
          style={{ maxWidth: '100%', overflow: 'auto' }}
        >
          <Component {...props} />
        </YStack>
      </YStack>

      {/* Code Preview */}
      {showCode && (
        <YStack gap="$2">
          <H2>Code</H2>
          <YStack
            bg="$color1"
            p="$2"
            borderRadius="$2"
            style={{
              fontFamily: 'monogap',
              whiteSpace: 'pre-wrap',
              overflowX: 'auto',
            }}
          >
            <Text color="$color12">{renderPropsCode()}</Text>
          </YStack>
        </YStack>
      )}

      {/* Variants Section */}
      {variants.length > 0 && (
        <YStack gap="$4">
          <H2>Variants</H2>
          <XStack flexWrap="wrap" gap="$4">
            {variants.map((variant, index) => (
              <YStack
                key={index}
                borderWidth={1}
                borderColor="$color7"
                p="$4"
                borderRadius="$4"
                width={300}
                minHeight={150}
                gap="$2"
              >
                <Text fontWeight="bold">{variant.name}</Text>
                <YStack flex={1} alignItems="center" justifyContent="center">
                  <Component {...variant.props} />
                </YStack>
                <Button size="$2" onPress={() => setProps(variant.props)}>
                  Apply
                </Button>
              </YStack>
            ))}
          </XStack>
        </YStack>
      )}
    </YStack>
  )
}
