import { useEffect, useState } from "react";
import axiosInstance from "../../redux/axiosInstance"; // ✅ Import your axios instance

export default function BookSession() {
  const [mentors, setMentors] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedMentor, setSelectedMentor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [notes, setNotes] = useState("");

  // Fetch mentors on mount
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("api/mentee/mentors");
        setMentors(res.data);
      } catch (err) {
        setError("Failed to load mentors.");
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  const handleMentorSelect = async (mentorId) => {
    setSelectedMentor(mentorId);
    setSelectedSlot("");
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `api/mentee/mentors/${mentorId}/availability`
      );
      setAvailability(res.data);
    } catch (err) {
      setError("Failed to load availability.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedMentor || !selectedSlot) return;

    try {
      setLoading(true);
      await axiosInstance.post("/api/mentee/sessions", {
        mentorId: selectedMentor,
        timeSlot: selectedSlot,
        notes,
      });

      alert("Session requested successfully!");
      setSelectedMentor(null);
      setSelectedSlot("");
      setNotes("");
      setAvailability([]);
    } catch (err) {
      setError("Failed to request session.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Book a Session</h2>

      {loading && <p className="text-gray-500 mb-4">Loading...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Step 1: Select Mentor */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Select Mentor</label>
        <select
          className="w-full border p-2 rounded"
          value={selectedMentor || ""}
          onChange={(e) => handleMentorSelect(e.target.value)}
        >
          <option value="" disabled>
            Select a mentor
          </option>
          {mentors.map((mentor) => (
            <option key={mentor._id} value={mentor._id}>
              {mentor.name} ({mentor.email})
            </option>
          ))}
        </select>
      </div>

      {/* Step 2: Select Time Slot */}
      {selectedMentor && (
        <div className="mb-6">
          <label className="block font-medium mb-2">Select Time Slot</label>
          <select
            className="w-full border p-2 rounded"
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
          >
            <option value="" disabled>
              Select a slot
            </option>
            {availability.map((slot) => (
              <option key={slot._id} value={slot.slot}>
                {new Date(slot.slot).toLocaleString()}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Step 3: Notes */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Notes (optional)</label>
        <textarea
          className="w-full border p-2 rounded"
          rows="3"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!selectedMentor || !selectedSlot || loading}
        className={`w-full py-2 px-4 rounded text-white font-medium ${
          !selectedMentor || !selectedSlot || loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        Request Session
      </button>
    </div>
  );
}
