import { Box, Container, withStyles } from "@material-ui/core";
import React from "react";
import HeaderPage from './Header/HeaderPage';

const MainLayoutContainer = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.primary,
    // height: "fit-content",
    width: "100%",
    //  minWidth: "fit-content",
  },
}))(Box);

export default function MainLayout(props) {
  return (
    <MainLayoutContainer>
      <HeaderPage />
      <Box minHeight="calc(100vh - 60px - 36px)" py={2}>
        <Container maxWidth="xl">{props.children}</Container>
      </Box>
      {/* <Footer /> */}
    </MainLayoutContainer>
  );
}
