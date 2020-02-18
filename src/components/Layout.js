/** @jsx jsx */
//   ^ Required to use the `sx` prop: https://theme-ui.com/sx-prop
import { ThemeProvider, jsx, Box, Flex, Styled } from "theme-ui";
import styled from "@emotion/styled";
import { theme } from "../styles/theme";

const AppBody = styled.div`
  display: flex;
  flex-direction: column;
`;
console.warn(theme);

var request = new XMLHttpRequest();
request.open('GET', 'https://nevada-cranks.herokuapp.com/results', true);

request.onload = function() {
  if (this.status >= 200 && this.status < 400) {
    // Success!
    var resp = this.response;
    console.log(resp);
  } else {
    console.warn('server error')

  }
};
request.onerror = function() {
  console.warn('didn\'t get it')
};
request.send();

export const Layout = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <Flex
        sx={{
          flexDirection: "column"
        }}
      >
        <header sx={{ bg: "primary", py: [2, 3] }}>
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
