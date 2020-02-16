/** @jsx jsx */
//   ^ Required to use the `sx` prop: https://theme-ui.com/sx-prop
import { ThemeProvider, jsx, Box, Flex, Styled } from "theme-ui";
import styled from "@emotion/styled";
import { theme } from "../styles/theme";

console.warn(theme);

export const Layout = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <Flex
        sx={{
          flexDirection: "column"
        }}
      >
        <header sx={{ bg: "primary", py: [2, 3], boxShadow: 2}}>
          <Styled.h1 sx={{ color: "background", px: [2, 5] }}>
            UglyCauc.us
          </Styled.h1>
          <marquee scrollamount="10">
            <Styled.p sx={{ color: "background" }}>
              PPP Cranks Investigate ...
            </Styled.p>
          </marquee>
        </header>
        <main
          sx={{
            py: 3,
            flex: "1 1 auto",
            width: "100%"
          }}
        >
          <Box
            sx={{
              width: ["100%", "720px"],
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              px: [2, 3, 4],
              m: "0 auto"
            }}
          >
            {children}
          </Box>
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
