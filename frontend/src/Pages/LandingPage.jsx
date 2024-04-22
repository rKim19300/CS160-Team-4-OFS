import React, { useEffect, useState, useRef } from "react";
import {
  Flex,
  Text,
  Button,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  Input,
  Divider,
} from "@chakra-ui/react";
import { IoLocationOutline } from "react-icons/io5";
import { FaRegEnvelope } from "react-icons/fa6";
import { TiPhoneOutline } from "react-icons/ti";
import toast, { Toaster } from "react-hot-toast";

import axiosInstance from "../axiosInstance";
import styles from "./LandingPage.module.css";

export default function LandingPage() {
  const [products, setProducts] = useState([]);

  async function fetchProducts() {
    try {
      const response = await axiosInstance.get("/api/allProducts");
      const data = response.data;
      console.log("Data", data);
      setProducts(data.slice(0, 5));
      console.log("Products", products);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <Flex className={styles.container}>
      <NavBar />

      {/* First Section  */}
      <Flex
        className={styles.firstSection}
        style={{
          backgroundImage: "url('header1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Flex className={styles.textSection}>
          <Text className={styles.headerText}>
            Bringing Fresh Groceries Directly to Your Doorstep!
          </Text>
          <Text className={styles.subHeaderText}>
            Enjoy top-quality groceries at the best prices, delivered straight
            to your doorstep
          </Text>
          <a href="/SignUp">
            <Button colorScheme="whatsapp" width="30%" marginTop="32px">
              Start Now
            </Button>
          </a>
        </Flex>
      </Flex>

      {/* Products Section */}
      <Text className={styles.productHeader} id="products">
        Some of Our Products...
      </Text>
      <Grid className={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product.product_id} product={product} />
        ))}
      </Grid>

      <Text className={styles.productHeader}>
        Why use our grocery delivery service?
      </Text>
      <FeatureSection />
      <img src="phone.jpg" className={styles.footerImg} />
      <AboutUs />

      <AddressCheck />
    </Flex>
  );
}

function NavBar() {
  return (
    <Grid
      templateAreas={`"nav main button"`}
      gridTemplateColumns={"10vw 1fr 10vw"}
      h="11vh"
      width="100%"
      gap="1"
      color="blackAlpha.700"
      fontWeight="bold"
    >
      <GridItem pl="2" area={"nav"}>
        <a href="/landing">
          <img className={styles.logoImg} src="/logo.png" />
        </a>
      </GridItem>
      <GridItem pl="2" area={"main"} className={styles.navSection}>
        <a href="#products">
          <Text className={styles.navText}>products</Text>
        </a>
        <a href="#about">
          <Text className={styles.navText}>about us</Text>
        </a>
        <a href="#contact">
          <Text className={styles.navText}>contact</Text>
        </a>
      </GridItem>
      <GridItem pl="2" area={"button"} className={styles.buttonSection}>
        <a href="/login">
          <Button colorScheme="whatsapp" variant="outline">
            Sign In
          </Button>
        </a>
      </GridItem>
    </Grid>
  );
}

function ProductCard({ product }) {
  return (
    <Flex className={styles.productCard}>
      <img className={styles.prodImg} src={product.image_url} />
      <Text className={styles.productTitle}>{product.name}</Text>
      <Text className={styles.productPrice}>${product.price.toFixed(2)}</Text>
      <Text className={styles.productWeight}>{product.weight} lbs</Text>
    </Flex>
  );
}

function FeatureSection() {
  return (
    <Flex className={styles.featuresSection}>
      <Flex className={styles.feature}>
        <div
          className={styles.circleIcon}
          style={{ backgroundColor: "#8fbc8f" }}
        >
          <img src="veggie.png" style={{ height: "70px" }} />
        </div>
        <Text className={styles.featureText}>Quality Products</Text>
        <Text className={styles.featureSubText}>
          Every product is sourced from top-quality suppliers to ensure the best
          and freshest products
        </Text>
      </Flex>
      <Flex className={styles.feature}>
        <div
          className={styles.circleIcon}
          style={{ backgroundColor: "#F7D9C4" }}
        >
          <img src="delivery.png" style={{ height: "70px" }} />
        </div>
        <Text className={styles.featureText}>Fast & Free Delivery</Text>
        <Text className={styles.featureSubText}>
          Enjoy our fast and free delivery on all orders under 20lbs
        </Text>
      </Flex>
      <Flex className={styles.feature}>
        <div
          className={styles.circleIcon}
          style={{ backgroundColor: "#FAEDCB" }}
        >
          <img src="box.png" style={{ height: "70px" }} />
        </div>
        <Text className={styles.featureText}>Eco-Friendly Packaging</Text>
        <Text className={styles.featureSubText}>
          Our packaging is 100% recyclable, supporting sustainability with every
          purchase you make
        </Text>
      </Flex>
    </Flex>
  );
}

function AboutUs() {
  return (
    <Flex className={styles.aboutSection} id="about">
      <img className={styles.aboutImg} src="aboutUs.jpg" />
      <Flex className={styles.aboutTextSection}>
        <Text className={styles.aboutHeader}>About Us</Text>
        <Text className={styles.aboutText} paddingBottom="24px">
          Welcome to OFS, your local source for organic food in the heart of San
          Jose Downtown. At OFS, our mission is to improve your life by
          providing you with the freshest, highest quality fruits, vegetables,
          and grocery items delivered directly to your doorstep. We understand
          the importance of convenience and sustainability, which is why we've
          introduced an eco-friendly, robot-driven delivery system designed to
          seamlessly integrate into your busy lifestyle.
        </Text>
        <Text className={styles.aboutText}>
          At OFS, we’re not simply a food retailer — we’re a part of your
          community. We empower our local farmers and producers through
          sustainable partnerships that promise to bring you only the best. Join
          us in our mission to make healthy living accessible and our city
          greener.
        </Text>
      </Flex>
    </Flex>
  );
}

function AddressCheck() {
  return (
    <Flex className={styles.AddressCheck}>
      <Flex>
        <Flex className={styles.AddressTextSection}>
          <Text className={styles.addressHeaderText}>
            We Apologize for the Inconvenience!
          </Text>
          <Text className={styles.addressText}>
            Currently, our delivery services are only available in select areas
            :(
          </Text>
          <Text>
            See if we deliver to your area by entering your address here
          </Text>
        </Flex>
        <AddressValidation />
      </Flex>
      <Divider marginBottom="32px" marginTop="48px" />
      <Flex gap="20vw" justifyContent="center" id="contact">
        <Flex flexDirection="column" alignItems="center">
          <div className={styles.contactIcon}>
            <FaRegEnvelope size="24px" />
          </div>
          <Text>ofsdelivery@ofs.com</Text>
        </Flex>

        <Flex flexDirection="column" alignItems="center">
          <div className={styles.contactIcon}>
            <TiPhoneOutline size="24px" />
          </div>
          <Text>(123) 456 - 7890</Text>
        </Flex>

        <a
          href="https://www.google.com/maps/search/?api=1&query=37.3351454%2C-121.8828895"
          target="__blank"
        >
          <Flex flexDirection="column" alignItems="center">
            <div className={styles.contactIcon}>
              <IoLocationOutline size="24px" />
            </div>
            <Flex flexDirection="column" alignItems="center">
              <Text>1 Washington Sq</Text>
              <Text>San Jose, CA 95192</Text>
            </Flex>
          </Flex>
        </a>
      </Flex>
    </Flex>
  );
}

function AddressValidation() {
  let addressInfo = {};
  const [addressLine1, setAddressLine1] = useState(
    addressInfo["addressLine1"] || ""
  );
  const [addressLine2, setAddressLine2] = useState(
    addressInfo["addressLine2"] || ""
  );
  const [city, setCity] = useState(addressInfo["city"] || "");
  const [state, setState] = useState(addressInfo["state"] || "");
  const [zipCode, setZipCode] = useState(addressInfo["zipCode"] || "");

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      let response = await axiosInstance.post("/api/validateAddress", {
        addressLine1,
        addressLine2,
        city,
        state,
        zipCode,
      });

      if (response.status !== 200) {
        toast.error(`Address validation failed: ${response.data}`);
        return;
      } else {
        toast.success("Your address is within our delivery range.");
      }
    } catch (err) {
      toast.error("Oops! Something went wrong on our end, please try again.");
      return;
    }
  };

  return (
    <Flex className={styles.formContainer}>
      <Toaster position="bottom-center" reverseOrder={false} />
      <form id="addressForm" onSubmit={submitForm}>
        <FormControl>
          <FormLabel className={styles.formText}>Address Line 1</FormLabel>
          <Input
            type="text"
            fontSize="16px"
            required
            name="addressLine1"
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
          />

          <FormLabel className={styles.formText}>Address Line 2</FormLabel>
          <Input
            type="text"
            fontSize="16px"
            name="addressLine2"
            value={addressLine2}
            onChange={(e) => setAddressLine2(e.target.value)}
          />
        </FormControl>

        <Flex justifyContent="space-between" paddingTop="8px">
          <Flex flexDirection="column">
            <FormLabel className={styles.formText}>City</FormLabel>
            <Input
              type="text"
              fontSize="16px"
              required
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </Flex>

          <Flex flexDirection="column">
            <FormLabel className={styles.formText}>State</FormLabel>
            <Input
              type="text"
              fontSize="16px"
              required
              name="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </Flex>

          <Flex flexDirection="column">
            <FormLabel className={styles.formText}>Zip Code</FormLabel>
            <Input
              type="number"
              fontSize="16px"
              required
              name="zipCode"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
          </Flex>
        </Flex>
        <Button type="submit" colorScheme="gray" marginTop="16px">
          Check Address
        </Button>
      </form>
    </Flex>
  );
}
