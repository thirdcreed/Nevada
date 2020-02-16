const colors = {
  blue: "#2071b5",
  black: "#000",
  white: "#fff",
  text: "#202124",
  secondary: "#1E2B39",
  muted: "#f1f3f4",
  gray: {
    "1": "hsl(0,0%,32%)",
    "2": "hsl(0,0%,47%)",
    "3": "hsl(0,0%,58%)",
    "4": "hsl(0,0%,68%)",
    "5": "hsl(0,0%,77%)",
    "6": "hsl(0,0%,85%)",
    "7": "hsl(0,0%,93%)"
  }
};

const fontFamilies = {
  mono: "Fira Mono",
  sans: "Roboto, system-ui, sans-serif",
  serif: "itc-american-typewriter, serif"
};

const fonts = {
  ...fontFamilies,
  body: fontFamilies.serif,
  heading: fontFamilies.serif
};

export const theme = {
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  fonts,
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 96],
  fontWeights: {
    body: 400,
    heading: 500,
    bold: 700
  },
  lineHeights: {
    body: 1.5,
    heading: 1.125
  },
  shadows: ["none", "inset 0 0 0 2px", "0 0 16px rgba(0, 0, 0, .25)"],
  colors: {
    ...colors,
    background: colors.white,
    text: colors.text,
    secondary: colors.secondary,
    primary: colors.blue,
    muted: "#f1f3f4"
  },
  radii: [0, 2, 3, 5, 10],
  styles: {
    root: {
      fontFamily: "body",
      lineHeight: "body",
      fontWeight: "body",
      "h1, h2, h3": {
        fontFamily: "heading",
        lineHeight: "heading"
      }
    },
    h1: {
      color: "text",
      fontFamily: "heading",
      lineHeight: "1.2",
      fontWeight: "heading",
      fontSize: 5
    },
    h2: {
      color: "text",
      fontFamily: "heading",
      lineHeight: "1.2",
      fontWeight: "heading",
      fontSize: 4
    },
    h3: {
      color: "text",
      fontFamily: "heading",
      lineHeight: "1.2",
      fontWeight: "heading",
      fontSize: 3
    },
    h4: {
      color: "text",
      fontFamily: "heading",
      lineHeight: "1.2",
      fontWeight: "heading",
      fontSize: 2
    },
    h5: {
      color: "text",
      fontFamily: "heading",
      lineHeight: "1.2",
      fontWeight: "heading",
      fontSize: 1
    },
    h6: {
      color: "text",
      fontFamily: "heading",
      lineHeight: "1.2",
      fontWeight: "heading",
      fontSize: 0
    },
    p: {
      color: "text",
      fontFamily: "body",
      fontWeight: "body",
      lineHeight: "body"
    },
    a: {
      color: "primary"
    },
    pre: {
      fontFamily: "monospace",
      overflowX: "auto"
    },
    code: {
      fontFamily: "monospace",
      fontSize: "inherit"
    },
    table: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: 0
    },
    th: {
      textAlign: "left",
      borderBottomStyle: "solid",
      borderBottomWidth: "1px",
      px: 1
    },
    td: {
      textAlign: "left",
      borderBottomStyle: "solid",
      borderBottomWidth: "1px",
      px: 1
    }
  },
  /* This section needs to be updated for theme-ui's newer interface */
  componentStyles: {
    Button: {
      display: "inline-block",
      background: "none",
      fontFamily: "sans",
      fontSize: 2,

      border: "none",
      py: 3,
      px: 3,
      mx: 1,
      my: 2,
      cursor: "pointer",
      outline: "inherit",
      color: "background",
      bg: "primary",
      boxShadow: 2,

      borderRadius: 3,
      ":disabled": {
        bg: "gray.5",
        color: "muted"
      },
      variants: {
        outline: {
          color: "primary",
          bg: "background",
          boxShadow: 1
        }
      }
    },
    Card: {
      p: 2,
      m: 1,
      display: "inline-block",
      borderRadius: 2,
      variants: {
        shadow: {
          boxShadow: 2
        }
      }
    },
    Heading: {
      lineHeight: "heading",
      fontWeight: "heading",
      fontFamily: "heading",
      fontSize: 5
    },
    Text: {
      lineHeight: "body",
      whiteSpace: "pre-wrap",
      fontFamily: "body"
    }
  }
};
