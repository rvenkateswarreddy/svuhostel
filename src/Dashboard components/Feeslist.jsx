import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FeesList.css"; // Import the CSS file
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const FeesList = () => {
  const [users, setUsers] = useState([]);
  const [editFormData, setEditFormData] = useState({
    days: "",
    leaveDays: "",
    nonVegCharge: "",
    vegCharge: "",
    totalFoodCharge: "",
    noonVegCharge: "",
    roomCharge: "",
    totalAmount: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editUserId, setEditUserId] = useState("");
  const [editMessId, setEditMessId] = useState("");

  useEffect(() => {
    fetchAllProfiles();
  }, []);

  const fetchAllProfiles = async () => {
    try {
      const response = await axios.get(
        "https://svhostel.onrender.com/allprofiles",
        {
          headers: {
            "x-token": localStorage.getItem("token"),
          },
        }
      );
      setUsers(response.data.data);
    } catch (error) {
      toast.error("Error fetching profiles:", error);
    }
  };

  const handleEdit = (userId, messId) => {
    const user = users.find((user) => user._id === userId);
    const messDetail = user.hostelMess.find((mess) => mess._id === messId);
    setEditFormData({ ...messDetail });
    setIsEditing(true);
    setEditUserId(userId);
    setEditMessId(messId);
  };

  const handleEditFormChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `https://svhostel.onrender.com/hostelmess/${editUserId}/${editMessId}`,
        editFormData,
        {
          headers: {
            "x-token": localStorage.getItem("token"),
          },
        }
      );
      if (response.status === 200) {
        const updatedUsers = users.map((user) => {
          if (user._id === editUserId) {
            user.hostelMess = user.hostelMess.map((mess) =>
              mess._id === editMessId ? { ...mess, ...editFormData } : mess
            );
          }
          return user;
        });
        setUsers(updatedUsers);
        toast.success("Mess detail edited successfully");
        setIsEditing(false);
        setEditUserId("");
        setEditMessId("");
        setEditFormData({
          days: "",
          leaveDays: "",
          nonVegCharge: "",
          vegCharge: "",
          totalFoodCharge: "",
          noonVegCharge: "",
          roomCharge: "",
          totalAmount: "",
        });
      } else {
        toast.error("Error editing mess detail:", response.data.error);
      }
    } catch (error) {
      toast.error("Error editing mess detail:", error);
    }
  };

  const handleRemove = async (userId, messId) => {
    try {
      const response = await axios.delete(
        `https://svhostel.onrender.com/hostelmess/${userId}`,
        {
          headers: {
            "x-token": localStorage.getItem("token"),
          },
          data: {
            _id: messId,
          },
        }
      );

      if (response.status === 200) {
        const updatedUsers = users.map((user) => {
          if (user._id === userId) {
            user.hostelMess = user.hostelMess.filter(
              (mess) => mess._id !== messId
            );
          }
          return user;
        });
        setUsers(updatedUsers);
        toast.success("Mess detail removed successfully");
      } else {
        toast.error("Error removing mess detail:", response.data.error);
      }
    } catch (error) {
      toast.error("Error removing mess detail:", error);
    }
  };
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditMessId("");
    setEditFormData({
      days: "",
      leaveDays: "",
      nonVegCharge: "",
      vegCharge: "",
      totalFoodCharge: "",
      noonVegCharge: "",
      roomCharge: "",
      totalAmount: "",
    });
  };
  return (
    <div className="wholefeeslist">
      <ToastContainer />
      <h2>Hostel Mess Details</h2>
      <div>
        <h3>Users with only one hostel mess detail:</h3>
        <table className="neumorphic-table-fees">
          <thead>
            <tr>
              <th>User</th>
              <th>Days</th>
              <th>Leave Days</th>
              <th>Non-Veg Charge</th>
              <th>Veg Charge</th>
              <th>Total Food Charge</th>
              <th>Noon Veg Charge</th>
              <th>Room Charge</th>
              <th>Total Amount</th>
              <th>Operation</th> {/* Add operation column */}
            </tr>
          </thead>
          <tbody>
            {users.map(
              (user) =>
                user.hostelMess.length === 1 && (
                  <tr key={user._id}>
                    <td>{user.fullname}</td>
                    <td>{user.hostelMess[0].days}</td>
                    <td>{user.hostelMess[0].leaveDays}</td>
                    <td>{user.hostelMess[0].nonVegCharge}</td>
                    <td>{user.hostelMess[0].vegCharge}</td>
                    <td>{user.hostelMess[0].totalFoodCharge}</td>
                    <td>{user.hostelMess[0].noonVegCharge}</td>
                    <td>{user.hostelMess[0].roomCharge}</td>
                    <td>{user.hostelMess[0].totalAmount}</td>
                    <td>
                      <button
                        onClick={() =>
                          handleEdit(user._id, user.hostelMess[0]._id)
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="removered"
                        onClick={() =>
                          handleRemove(user._id, user.hostelMess[0]._id)
                        }
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>
      <div>
        <h3>Users with multiple hostel mess details:</h3>
        {users.map(
          (user) =>
            user.hostelMess.length > 1 && (
              <div key={user._id}>
                <table className="neumorphic-table-fees">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Days</th>
                      <th>Leave Days</th>
                      <th>Non-Veg Charge</th>
                      <th>Veg Charge</th>
                      <th>Total Food Charge</th>
                      <th>Noon Veg Charge</th>
                      <th>Room Charge</th>
                      <th>Total Amount</th>
                      <th>Operation</th> {/* Add operation column */}
                    </tr>
                  </thead>
                  <tbody>
                    {user.hostelMess.map((mess, index) => (
                      <tr key={`${user._id}-${index}`}>
                        <td>{user.fullname}</td>
                        <td>{mess.days}</td>
                        <td>{mess.leaveDays}</td>
                        <td>{mess.nonVegCharge}</td>
                        <td>{mess.vegCharge}</td>
                        <td>{mess.totalFoodCharge}</td>
                        <td>{mess.noonVegCharge}</td>
                        <td>{mess.roomCharge}</td>
                        <td>{mess.totalAmount}</td>
                        <td>
                          <button
                            onClick={() => handleEdit(user._id, mess._id)}
                          >
                            Edit
                          </button>
                          <button
                            className="removered"
                            onClick={() => handleRemove(user._id, mess._id)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
        )}
      </div>
      {isEditing && (
        <div>
          <form className="formedit" onSubmit={handleEditFormSubmit}>
            <h3>Edit mess Details</h3>
            <h3></h3>

            <div>
              <label htmlFor="days">Days:</label>
              <input
                type="text"
                id="days"
                name="days"
                value={editFormData.days}
                onChange={handleEditFormChange}
              />
            </div>
            <div>
              <label htmlFor="leaveDays">Leave Days:</label>
              <input
                type="text"
                id="leaveDays"
                name="leaveDays"
                value={editFormData.leaveDays}
                onChange={handleEditFormChange}
              />
            </div>
            <div>
              <label htmlFor="nonVegCharge">Non-Veg Charge:</label>
              <input
                type="text"
                id="nonVegCharge"
                name="nonVegCharge"
                value={editFormData.nonVegCharge}
                onChange={handleEditFormChange}
              />
            </div>
            <div>
              <label htmlFor="vegCharge">Veg Charge:</label>
              <input
                type="text"
                id="vegCharge"
                name="vegCharge"
                value={editFormData.vegCharge}
                onChange={handleEditFormChange}
              />
            </div>
            <div>
              <label htmlFor="totalFoodCharge">Total Food Charge:</label>
              <input
                type="text"
                id="totalFoodCharge"
                name="totalFoodCharge"
                value={editFormData.totalFoodCharge}
                onChange={handleEditFormChange}
              />
            </div>
            <div>
              <label htmlFor="noonVegCharge">Noon Veg Charge:</label>
              <input
                type="text"
                id="noonVegCharge"
                name="noonVegCharge"
                value={editFormData.noonVegCharge}
                onChange={handleEditFormChange}
              />
            </div>
            <div>
              <label htmlFor="roomCharge">Room Charge:</label>
              <input
                type="text"
                id="roomCharge"
                name="roomCharge"
                value={editFormData.roomCharge}
                onChange={handleEditFormChange}
              />
            </div>
            <div>
              <label htmlFor="totalAmount">Total Amount:</label>
              <input
                type="text"
                id="totalAmount"
                name="totalAmount"
                value={editFormData.totalAmount}
                onChange={handleEditFormChange}
              />
            </div>
            <button type="submit">Save Changes</button>
            <button type="button" onClick={handleCancelEdit}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default FeesList;
