const fs = require('fs')
const path = require('path')

const directories = [
  path.join(__dirname, '../app'),
  path.join(__dirname, '../components'),
]

function updateImports(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8')
  const updatedContent = fileContent.replace(/@\/([^']+)/g, (match, p1) => {
    const relativePath = path.relative(
      path.dirname(filePath),
      path.join(__dirname, '../', p1)
    )
    return relativePath.replace(/\\/g, '/')
  })
  fs.writeFileSync(filePath, updatedContent, 'utf8')
}

function walkDirectory(directory) {
  fs.readdirSync(directory).forEach(file => {
    const fullPath = path.join(directory, file)
    if (fs.lstatSync(fullPath).isDirectory()) {
      walkDirectory(fullPath)
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      updateImports(fullPath)
    }
  })
}

directories.forEach(directory => walkDirectory(directory))
