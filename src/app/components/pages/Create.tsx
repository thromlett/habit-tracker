//DELETE LATER
"use client";
import { useState } from "react";
import BottomBar from "../../components/BottomBar";
/* 
localhost/api/habits GET //this gets all habits
localhost/api/habits/:id GET //gets a single habit by id
localhost/api/habits/:id/logs POST
localhost/api/habits/:id/logs GET

localhost/api/order/:id PATCH

localhost/api/log POST //tracks the habit referenced by id
localhost/api/log/:id GET //gets an instance of the log entity
localhost/api/log/:id?habit=<habitid> GET //gets an instance of the log entity
localhost/api/log/:id DELETE 
 */
export default function CreatePage() {
  const [name, setName] = useState("");
  const [disposition, setDisposition] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [frequency, setFrequency] = useState("");

  const [daysSelected, setDaysSelected] = useState<string[]>([]);
  const [timesPerWeek, setTimesPerWeek] = useState<number | "">("");
  const [customDates, setCustomDates] = useState<string[]>([]);
  const [intervalValue, setIntervalValue] = useState<number | "">("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // validate here

    //request body
    const body = {
      name,
      disposition: disposition.toUpperCase() === "GOOD" ? "GOOD" : "BAD",
      description,
      schedule: {
        type: frequency,
        days: [
          "MONDAY",
          "TUESDAY",
          "WEDNESDAY",
          "THURSDAY",
          "FRIDAY",
          "SATURDAY",
          "SUNDAY",
        ],
      }, // Placeholder for schedule, make adjustable later
    };

    // POST to backend
    const res = await fetch("/api/habit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to create habit");
      setLoading(false);
    } else {
      setSuccess(true);
      setName("");
      setDisposition("");
      setFrequency("");
      setDescription("");
      setLoading(false);
      // redirect or show success message
    }
  }

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      <main className="max-w-md mx-auto pt-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Create Habit</h1>
        <form
          className="bg-white rounded-xl shadow p-6 space-y-4"
          onSubmit={handleSubmit}
        >
          {/* Habit Name */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Habit Name
            </label>
            <input
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="e.g. Meditate"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          {/*frequency */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Frequency
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              value={disposition}
              onChange={(e) => setFrequency(e.target.value)}
              required
            >
              <option value="" disabled>
                Select type
              </option>
              <option value="daysOfWeek">Specific Days</option>
              <option value="timePerWeek">Times Per Week</option>
              <option value="customDates">Custom Dates</option>
              <option value="interval">Intervals</option>
            </select>
          </div>

          {/* Frequency Options */}
          {frequency === "daysOfWeek" && (
            <div>
              <label className="block text-sm font-semibold mb-1">
                Select Days
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "MONDAY",
                  "TUESDAY",
                  "WEDNESDAY",
                  "THURSDAY",
                  "FRIDAY",
                  "SATURDAY",
                  "SUNDAY",
                ].map((day) => (
                  <label key={day} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      value={day}
                      checked={daysSelected.includes(day)}
                      onChange={(e) => {
                        const value = e.target.value;
                        setDaysSelected((prev) =>
                          prev.includes(value)
                            ? prev.filter((d) => d !== value)
                            : [...prev, value]
                        );
                      }}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">{day}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          {frequency === "timePerWeek" && (
            <div>
              <label className="block text-sm font-semibold mb-1">
                Times Per Week
              </label>
              <input
                type="number"
                min={1}
                max={7}
                value={timesPerWeek}
                onChange={(e) => setTimesPerWeek(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          )}
          {frequency === "customDates" && (
            <div>
              <label className="block text-sm font-semibold mb-1">
                Custom Dates (YYYY-MM-DD)
              </label>
              <textarea
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter dates separated by commas"
                rows={3}
                value={customDates.join(", ")}
                onChange={(e) =>
                  setCustomDates(e.target.value.split(",").map((d) => d.trim()))
                }
              />
            </div>
          )}
          {frequency === "interval" && (
            <div>
              <label className="block text-sm font-semibold mb-1">
                Interval (in days)
              </label>
              <input
                type="number"
                min={1}
                value={intervalValue}
                onChange={(e) => setIntervalValue(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          {/* Good or Bad */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Habit Type
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              value={disposition}
              onChange={(e) => setDisposition(e.target.value)}
              required
            >
              <option value="" disabled>
                Select type
              </option>
              <option value="GOOD">Good Habit</option>
              <option value="BAD">Bad Habit</option>
            </select>
          </div>
          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Describe your habit and its purpose"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold text-lg shadow hover:bg-blue-700 transition"
          >
            {loading ? "Adding..." : "Add Habit"}
          </button>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-600">Habit created!</p>}
        </form>
      </main>
      <BottomBar />
    </div>
  );
}
