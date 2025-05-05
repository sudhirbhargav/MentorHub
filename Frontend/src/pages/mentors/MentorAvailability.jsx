import { useEffect, useState } from "react";
import axiosInstance from "../../redux/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MentorAvailability = () => {
  const [slots, setSlots] = useState([]);
  const [dayOfWeek, setDayOfWeek] = useState("Monday");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchAvailability = async () => {
    try {
      const res = await axiosInstance.get("/api/mentor/availability", {
        headers,
      });
      setSlots(res.data);
    } catch (err) {
      console.error("Error fetching availability", err);
      toast.error("Failed to fetch availability.");
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  const handleAddSlot = async () => {
    if (!startTime || !endTime)
      return toast.warning("Please select start and end time.");

    try {
      const res = await axiosInstance.post(
        "/api/mentor/availability",
        {
          slots: [{ dayOfWeek, startTime, endTime }],
        },
        { headers }
      );

      const newSlot = res.data.slots ? res.data.slots[0] : null;

      if (newSlot) {
        // Update slots state directly with the newly added slot
        setSlots((prev) => [...prev, newSlot]);
      }
      fetchAvailability();
      setStartTime("");
      setEndTime("");
      toast.success("Slot added successfully!");
    } catch (err) {
      console.error("Error adding slot", err);
      toast.error("Failed to add slot.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/mentor/availability/${id}`, {
        headers,
      });
      setSlots((prev) => prev.filter((slot) => slot._id !== id));
      toast.success("Slot deleted successfully!");
    } catch (err) {
      console.error("Error deleting slot", err);
      toast.error("Failed to delete slot.");
    }
  };

  return (
    <div className="p-6">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Set Your Availability</h2>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <select
          className="p-2 border rounded"
          value={dayOfWeek}
          onChange={(e) => setDayOfWeek(e.target.value)}
        >
          {[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>

        <input
          type="time"
          className="p-2 border rounded"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />

        <input
          type="time"
          className="p-2 border rounded"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />

        <button
          onClick={handleAddSlot}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Slot
        </button>
      </div>

      <h3 className="text-xl font-semibold mb-2">Your Availability</h3>
      {!Array.isArray(slots) || slots.length === 0 ? (
        <p>No slots added yet.</p>
      ) : (
        <ul className="space-y-2">
          {slots.map((slot) => (
            <li
              key={slot._id}
              className="flex justify-between items-center bg-gray-100 p-2 rounded"
            >
              <span>
                {slot.dayOfWeek}: {slot.startTime} - {slot.endTime}
              </span>
              <button
                onClick={() => handleDelete(slot._id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MentorAvailability;
