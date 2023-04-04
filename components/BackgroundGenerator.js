import React, { useState, useEffect, useContext } from "react";
import { ImageBackground, StyleSheet } from "react-native";

const imageBackgroundArray = [
  require("../assets/BGvariant130.png"),
  require("../assets/BGvariantBigBen.png"),
  require("../assets/BGvariantBurjKhalifa.png"),
  require("../assets/BGvariantColosseum.png"),
  require("../assets/BGvariantGoldenBridge.png"),
  require("../assets/BgVariantdubaiv2.png"),
  require("../assets/BGvariantEgyptCity.png"),
  require("../assets/BGVariantNYC.png"),
  require("../assets/BGvariantPyramidsv2.png"),
  //   require("../assets/BGvariantRomev2.png"), // too dark
  require("../assets/BGvariantVenice.png"),
  require("../assets/BGvariantSyndneyHousev2.png"),
  require("../assets/BGvariantVenicev2.png"),
];

export const BackgroundGenerator = ({ children }) => {
  const [bgIndex, setBgIndex] = useState(
    Math.floor(Math.random() * imageBackgroundArray.length)
  );

  useEffect(() => {
    changeBackground();
  }, []);

  const changeBackground = () => {
    setBgIndex(Math.floor(Math.random() * imageBackgroundArray.length));
  };

  return (
    <ImageBackground
      source={imageBackgroundArray[bgIndex]}
      style={styles.cardBackground}
    >
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  cardBackground: {
    flex: 1,
    resizeMode: "cover",
    resizeMode: "cover",
    alignItems: "center",
  },
});
