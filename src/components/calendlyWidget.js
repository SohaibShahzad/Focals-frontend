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

    // Add event listener for Calendly event_scheduled event
    // const handleEventScheduled = (event) => {
    //   if (event.data && event.data.event === "calendly.event_scheduled") {
    //     console.log("Event scheduled");

    //     const formData = new FormData();
    //     formData.append("email", email);
    //     // formData.append("projectName", serviceData.title);

    //     // Send data to server
    //     axios
    //       .post(
    //         `${process.env.NEXT_PUBLIC_SERVER_URL}projects/addNewProject`,
    //         formData
    //       )
    //       .then((res) => {
    //         console.log(res);
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //       });
    //   }
    // };

    // window.addEventListener("message", handleEventScheduled);

    // // Clean up event listener on component unmount
    // return () => {
    //   window.removeEventListener("message", handleEventScheduled);
    // };
  }, []);

  return (
    <div
      className="calendly-inline-widget"
      data-url={`https://calendly.com/futurefocals?primary_color=ff6b00`}
      // data-url={`https://calendly.com/futurefocals?primary_color=ff6b00&a1=${encodeURIComponent(
      //   `Service: *${serviceData.title}* \nBundle-Name: ${bundle.name}, Price: ${bundle.price}`
      // )}&email=${encodeURIComponent(email)}`}
      style={{ minWidth: "420px", height: "700px" }}
    ></div>
  );
}

export default CalendlyWidget;
