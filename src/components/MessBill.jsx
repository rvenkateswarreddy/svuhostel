import React, { useEffect, useState } from "react";
import axios from "axios";

const MessBill = ({ data }) => {
  const [messDetails, setMessDetails] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!data) return; // Return early if data is undefined
        const response = await axios.get(
          `https://svhostel.onrender.com/hostelmess/${data._id}`
        );
        setMessDetails(response.data.data || []); // Ensure that messDetails is always an array
      } catch (error) {
        console.error("Error fetching mess details:", error);
      }
    };

    fetchData();
  }, [data]); // Include data in the dependency array

  return (
    <div>
      <h2>Mess Bill Details</h2>
      {messDetails.length > 0
        ? messDetails.map((details, index) => (
            <div key={index}>
              <p>Days: {details.days}</p>
              <p>Leave Days: {details.leaveDays}</p>
              <p>Non-Veg Charge: {details.nonVegCharge}</p>
              <p>Veg Charge: {details.vegCharge}</p>
              <p>Total Food Charge: {details.totalFoodCharge}</p>
              <p>Noon Veg Charge: {details.noonVegCharge}</p>
              <p>Room Charge: {details.roomCharge}</p>
              <p>Total Amount: {details.totalAmount}</p>
            </div>
          ))
        : "NO MESS DETAILS ARE AVAILABLE"}
    </div>
  );
};

export default MessBill;
