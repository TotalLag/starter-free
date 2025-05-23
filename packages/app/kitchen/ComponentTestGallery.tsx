import { Button, YStack, H1, Paragraph, XStack, Spinner } from '@my/ui'
import { Link } from 'solito/link'
import { useEffect, useState } from 'react'

// This will be generated by our script
interface ManifestItem {
  name: string
  slug: string
  exportName: string
}

export function ComponentTestGallery() {
  const [components, setComponents] = useState<ManifestItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Dynamically import the manifest
    import('./manifest.json')
      .then((module) => {
        setComponents(module.default)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load manifest:', err)
        setError('Failed to load component manifest. Did you run "yarn generate:kitchen"?')
        setLoading(false)
      })
  }, [])

  return (
    <YStack p="$4" gap="$4">
      <YStack gap="$2">
        <H1>Component Test Gallery</H1>
        <Paragraph color="$color10">Interactive testing environment for UI components</Paragraph>
      </YStack>

      {loading && (
        <YStack padding="$4" alignItems="center">
          <Spinner size="large" />
          <Paragraph>Loading components...</Paragraph>
        </YStack>
      )}

      {error && (
        <YStack padding="$4" backgroundColor="$red2" borderRadius="$2">
          <Paragraph color="$red10">{error}</Paragraph>
        </YStack>
      )}

      {!loading && !error && (
        <>
          {components.length === 0 ? (
            <Paragraph>
              No components found. Create .testbed.tsx files in packages/app/kitchen/ and run yarn
              generate:kitchen.
            </Paragraph>
          ) : (
            <XStack flexWrap="wrap" gap="$4">
              {components.map((component) => (
                <Link key={component.name} href={`/kitchen/${component.slug}`}>
                  <Button size="$4" width={200} height={100}>
                    {component.name}
                  </Button>
                </Link>
              ))}
            </XStack>
          )}
        </>
      )}
    </YStack>
  )
}
