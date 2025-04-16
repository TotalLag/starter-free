#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Path to the kitchen directory
const kitchenDir = path.resolve(__dirname, '../packages/app/kitchen')
const manifestPath = path.join(kitchenDir, 'manifest.json')

// Function to convert component name to slug
function toSlug(name) {
  return name
    .replace(/([a-z])([A-Z])/g, '$1-$2') // Convert camelCase to kebab-case
    .toLowerCase()
}

// Scan the kitchen directory for testbed files
async function generateManifest() {
  console.log('Scanning for testbed files in:', kitchenDir)

  try {
    const files = fs.readdirSync(kitchenDir)
    const testbedFiles = files.filter((file) => file.endsWith('.testbed.tsx'))

    const components = testbedFiles.map((file) => {
      // Extract component name (remove .testbed.tsx)
      const componentName = path.basename(file, '.testbed.tsx')
      const exportName = `${componentName}Testbed`
      const slug = toSlug(componentName)

      return {
        name: componentName,
        slug,
        exportName,
      }
    })

    // Write the manifest file
    fs.writeFileSync(manifestPath, JSON.stringify(components, null, 2))

    console.log(`Generated manifest with ${components.length} components:`)
    components.forEach((comp) => {
      console.log(`- ${comp.name} (${comp.slug})`)
    })
    console.log(`Manifest written to: ${manifestPath}`)
  } catch (error) {
    console.error('Error generating manifest:', error)
    process.exit(1)
  }
}

// Run the function
generateManifest()
