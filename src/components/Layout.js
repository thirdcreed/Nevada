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
        <header sx={{ bg: "muted", py: [2, 3], boxShadow: 2 }}>
          <Styled.h1
            sx={{ textDecoration: "underline", color: "gray.1", px: [2, 5] }}
          >
            UglyCauc.us
          </Styled.h1>
          <marquee scrollamount="10">
            <Styled.p sx={{ color: "gray.2" }}>Cranks Investigate ...</Styled.p>
          </marquee>
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
