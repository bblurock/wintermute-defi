import { extendTheme } from "@chakra-ui/react"

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
}

const _theme = {
  styles: {
    global: {
      'html, body': {
          padding: 0,
          margin: 0,
          fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
          background: '#e8e5db',
      },
      a: {
        color: 'teal.500',
        textDecoration: 'none'
      },
      '*': {
          boxSizing: 'border-box'
      }
    },
    ...config,
  }
}

// 3. extend the theme
const theme = extendTheme(_theme)

export default theme