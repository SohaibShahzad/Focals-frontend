import React, { useEffect } from "react";
import axios from "axios";

function CalendlyWidget({ bundle, serviceData, email }) {
  useEffect(() => {
    // Append Calendly script to the document head
    const head = document.querySelector("head");
    const script = document.createElement("script");
    script.setAttribute(
      "src",
      "https://assets.calendly.com/assets/external/widget.js"
    );
    head.appendChild(script);

  }, []);

  return (
    <div
      className="calendly-inline-widget"
      data-url={`https://calendly.com/futurefocals?primary_color=ff6b00`}
      // data-url={`https://calendly.com/futurefocals?primary_color=ff6b00&a1=${encodeURIComponent(
      //   `Service: *${serviceData.title}* \nBundle-Name: ${bundle.name}, Price: ${bundle.price}`
      // )}&email=${encodeURIComponent(email)}`}
      style={{ minWidth: "500px", height: "700px" }}
    ></div>
  );
}

export default CalendlyWidget;
