import React, { useState } from "react";

const PatientProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    gender: "male",
    profilePhoto: null,
    medicalReport: null,
  });

  const [reportHistory, setReportHistory] = useState([
    // Sample mock history. Replace this with fetched data from backend
    {
      id: 1,
      name: "Blood_Test_Report.pdf",
      uploadedAt: "2025-07-20",
      url: "#",
    },
    {
      id: 2,
      name: "MRI_Scan.png",
      uploadedAt: "2025-07-25",
      url: "#",
    },
  ]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    // Add new report to history (simulate response from backend)
    if (formData.medicalReport) {
      const newReport = {
        id: Date.now(),
        name: formData.medicalReport.name,
        uploadedAt: new Date().toISOString().split("T")[0],
        url: "#",
      };
      setReportHistory([newReport, ...reportHistory]);
    }

    // Clear file field
    setFormData({ ...formData, medicalReport: null });
    e.target.reset();
  };

  return (
    <div className="min-h-screen text-black bg-gray-50 flex justify-center px-4 py-8">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-center">Update Patient Profile</h2>

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              className="input input-bordered w-full"
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="input input-bordered w-full"
              onChange={handleChange}
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
            <select
              name="gender"
              className="select select-bordered w-full"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Profile photo (optional) */}
          <div>
            <label className="label font-medium">Profile Photo (optional)</label>
            <input
              type="file"
              name="profilePhoto"
              accept="image/*"
              className="file-input file-input-bordered w-full"
              onChange={handleChange}
            />
          </div>

          {/* Upload medical report */}
          <div>
            <label className="label font-medium">Upload Medical Report (PDF/Image)</label>
            <input
              type="file"
              name="medicalReport"
              accept=".pdf,image/*"
              className="file-input file-input-bordered w-full"
              required
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
          >
            Save Profile & Upload Report
          </button>
        </form>

        {/* Medical Report History */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">📜 Uploaded Reports History</h3>
          {reportHistory.length === 0 ? (
            <p className="text-gray-500">No reports uploaded yet.</p>
          ) : (
            <ul className="space-y-3">
              {reportHistory.map((report) => (
                <li
                  key={report.id}
                  className="flex justify-between items-center p-3 bg-gray-100 rounded-md"
                >
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-gray-500">
                      Uploaded: {report.uploadedAt}
                    </p>
                  </div>
                  <a
                    href={report.url}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
