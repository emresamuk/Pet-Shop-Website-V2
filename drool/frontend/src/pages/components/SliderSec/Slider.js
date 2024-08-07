import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import "./Slider.css";

function Slider() {
  const [sliderItems, setSliderItems] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/admin/sliders")
      .then((response) => {
        setSliderItems(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Fragment>
      <div className="hero_area ">
        <section className="slider_section">
          <div
            id="carouselExampleIndicators"
            className="carousel slide"
            data-ride="carousel"
          >
            <ol className="carousel-indicators">
              {sliderItems.map((item, index) => (
                <li
                  key={index}
                  data-target="#carouselExampleIndicators"
                  data-slide-to={index}
                  className={index === 0 ? "active" : ""}
                ></li>
              ))}
            </ol>
            <div className="carousel-inner">
              {sliderItems.map((item, index) => (
                <div
                  key={index}
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                >
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-md-5 offset-md-1">
                        <div className="detail-box">
                          <div className="number">
                            <h5>0{index + 1}</h5>
                          </div>
                          <h1>
                            {item.title} <br />
                            <span>{item.description}</span>
                          </h1>
                          <p>{item.description}</p>
                          <div className="btn-box">
                            <a href="xyz" className="btn-1">
                              Read More
                            </a>
                            <a href="xyz" className="btn-2">
                              Contact Us
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="img-box">
                          <img src={item.image_url} alt="" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Fragment>
  );
}

export default Slider;
