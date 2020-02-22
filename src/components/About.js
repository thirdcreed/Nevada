/** @jsx jsx */

import { jsx, Box, Styled } from "theme-ui";

const frontendRepo = "https://github.com/thirdcreed/Nevada";
const dataRepo = "https://github.com/GOliveira10/Nevada-Caucus-Monitoring";
const twitterLink = "https://twitter.com/uglycaucus";
const emailLink = "mailto:uglycauc.us@gmail.com";
const paypal = "https://www.paypal.com/paypalme2/uglycaucus";
export const About = () => {
  return (
    <Box sx={{ width: ["100%", "75%"], mx: 4, px: [2, 3] }}>
      <Styled.h2>About Us</Styled.h2>
      <Styled.p>
        We are a group of independent researchers who are trying to understand
        the Nevada caucus results in real time. Data is periodically collected
        from the World Wild Web, passed through our data pipeline [
        <Styled.a href={dataRepo} target="_blank">
          source
        </Styled.a>
        ] and displayed on this website [
        <Styled.a href={frontendRepo} target="_blank">
          source
        </Styled.a>
        ].
      </Styled.p>
      <Styled.p>
        We've tried our best to get the math right; If you find an issue please
        help us by filing an issue with the repositories and reach out to{" "}
        <Styled.a href={twitterLink} target="_blank">
          @uglycaucus
        </Styled.a>{" "}
        on twitter so we can post an update. Likewise, we'll post all serious
        updates to our twitter.
        <br />
      </Styled.p>
      <Styled.p>
        We are not affiliated with any legitimate political, news or policy
        organization.
      </Styled.p>
      <Styled.h3>Contact Us:</Styled.h3>
      <Styled.p>
        Email: <Styled.a href={emailLink}>uglycauc.us@gmail.com</Styled.a>
      </Styled.p>
      <Styled.p>
        Twitter:{" "}
        <Styled.a href={twitterLink} target="_blank">
          @uglycaucus
        </Styled.a>
      </Styled.p>
      <Styled.p>
        <Styled.a href={paypal} target="_blank">
          paypal.me/uglycaucus
        </Styled.a>
      </Styled.p>
    </Box>
  );
};
