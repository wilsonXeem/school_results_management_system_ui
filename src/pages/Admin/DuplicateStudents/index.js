import React, { useState, useEffect } from "react";
import "./duplicates.css";
import Loader from "../../../components/Loader";

function DuplicateStudents() {
  const [loading, setLoading] = useState(false);
  const [duplicates, setDuplicates] = useState([]);
  const [selectedKeep, setSelectedKeep] = useState({});
  const [merging, setMerging] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchDuplicates = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:1234/api/class/find-duplicates");
      const json = await response.json();
      if (response.ok) {
        setDuplicates(json.duplicates || []);
        // Auto-select the profile with most courses for each group
        const autoSelect = {};
        json.duplicates.forEach((dup) => {
          const best = dup.profiles.reduce((prev, curr) =>
            curr.totalCourses > prev.totalCourses ? curr : prev
          );
          autoSelect[dup.reg_no] = best._id;
        });
        setSelectedKeep(autoSelect);
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to fetch duplicates" });
    } finally {
      setLoading(false);
    }
  };

  const handleMerge = async (reg_no) => {
    const keepId = selectedKeep[reg_no];
    if (!keepId) return;

    setMerging(true);
    try {
      const response = await fetch("http://127.0.0.1:1234/api/class/merge-specific-duplicate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reg_no, keepId }),
      });
      const json = await response.json();
      if (response.ok) {
        setMessage({ type: "success", text: json.message });
        fetchDuplicates();
      } else {
        throw new Error(json.message);
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setMerging(false);
    }
  };

  useEffect(() => {
    fetchDuplicates();
  }, []);

  return (
    <div className="duplicates_page">
      <div className="duplicates_header">
        <h2>Duplicate Student Profiles</h2>
        <p>Review and merge duplicate student profiles with the same registration number</p>
        <button className="refresh_btn" onClick={fetchDuplicates} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
          <button onClick={() => setMessage({ type: "", text: "" })}>×</button>
        </div>
      )}

      {loading && <Loader />}

      {!loading && duplicates.length === 0 && (
        <div className="no_duplicates">
          <p>No duplicate student profiles found</p>
        </div>
      )}

      {!loading && duplicates.length > 0 && (
        <div className="duplicates_list">
          {duplicates.map((dup) => (
            <div key={dup.reg_no} className="duplicate_group">
              <div className="duplicate_group_header">
                <h3>Registration Number: {dup.reg_no}</h3>
                <span className="duplicate_count">{dup.profiles.length} profiles found</span>
              </div>

              <div className="profiles_grid">
                {dup.profiles.map((profile) => (
                  <div
                    key={profile._id}
                    className={`profile_card ${
                      selectedKeep[dup.reg_no] === profile._id ? "selected" : ""
                    }`}
                  >
                    <div className="profile_select">
                      <input
                        type="radio"
                        name={`keep_${dup.reg_no}`}
                        checked={selectedKeep[dup.reg_no] === profile._id}
                        onChange={() =>
                          setSelectedKeep({ ...selectedKeep, [dup.reg_no]: profile._id })
                        }
                      />
                      <label>Keep this profile</label>
                    </div>
                    <div className="profile_details">
                      <p>
                        <strong>Name:</strong> {profile.fullname}
                      </p>
                      <p>
                        <strong>Level:</strong> {profile.level}
                      </p>
                      <p>
                        <strong>CGPA:</strong> {profile.cgpa}
                      </p>
                      <p>
                        <strong>Total Semesters:</strong> {profile.totalSemesters}
                      </p>
                      <p>
                        <strong>Total Courses:</strong> {profile.totalCourses}
                      </p>
                      <p className="profile_id">
                        <strong>ID:</strong> {profile._id}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="duplicate_actions">
                <button
                  className="merge_btn"
                  onClick={() => handleMerge(dup.reg_no)}
                  disabled={merging || !selectedKeep[dup.reg_no]}
                >
                  {merging ? "Merging..." : "Merge Selected"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DuplicateStudents;
