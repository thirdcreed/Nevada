/** @jsx jsx */
//   ^ Required to use the `sx` prop: https://theme-ui.com/sx-prop
import { ThemeProvider, jsx, Flex, Styled } from "theme-ui";
import { theme } from "../styles/theme";

export const Layout = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <Flex
        sx={{
          flexDirection: "column"
        }}
      >
        <header sx={{ bg: "background", p: [2, 3], textAlign: "center" }}>
          <Styled.h1
            sx={{
              textDecoration: "underline",
              color: "gray.1",
              px: [2, 5],
              fontWeight: 4
            }}
          >
            UglyCauc.us
          </Styled.h1>

          <Styled.h3 sx={{ color: "gray.2" }}>
            Analyzing the Nevada Caucus results in real time
          </Styled.h3>
        </header>
        <main
          sx={{
            py: 3,
            flex: "1 1 auto",
            width: "100%"
          }}
        >
          {children}
        </main>
        <footer
          sx={{ bg: "primary", py: [2, 3], px: [2, 5], color: "background" }}
        >
          <Styled.p sx={{ color: "background" }}>© etc etc</Styled.p>
          <Styled.a
            sx={{ color: "background" }}
            href="https://www.clintonfoundation.org/"
          >
            Source
          </Styled.a>
        </footer>
      </Flex>
    </ThemeProvider>
  );
};
