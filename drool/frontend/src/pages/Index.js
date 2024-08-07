import React, { Fragment } from "react";
import About from "./components/AboutPage/About";
import Slider from "./components/SliderSec/Slider";
import Contact from "./components/ContactPage/Contact";
import Product from "./components/ProductList/Product";
import TestimonialShow from "./components/TestimonialPage/TestimonialShow";


function Index() {
  return (
    <Fragment>
      <Slider />
      <About />
      <Product />
      <TestimonialShow />
      <Contact />
    </Fragment>
  );
}

export default Index;
