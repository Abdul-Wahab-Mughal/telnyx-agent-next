import { useEffect, useState } from "react";
import "../app/globals.css";

interface Assistant {
  id: string;
  name: string;
  description?: string;
  model?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

interface Model {
  id: string;
}

interface Phone {
  id: string;
  phone_numbers: string;
  phone_number: string;
}

export default function AssistantsTable() {
  const [value, setValue] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedPhone, setSelectedPhone] = useState<string>("");

  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [model, setModel] = useState<Model[]>([]);
  const [phone, setPhone] = useState<Phone[]>([]);

  const [updateAgent, setUpdateAgent] = useState<Assistant | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [updateBox, setUpdateBox] = useState<boolean>(false);

  // Fetch
  //
  //

  // Agent List
  async function fetchAssistants() {
    try {
      const res = await fetch("/api/telnyx/all-assistants");
      const data = await res.json();
      // console.log(data);
      setAssistants(data || []);
    } catch (error) {
      console.error("Failed to fetch assistants:", error);
    }
  }

  // Fetch Model
  const getModel = async () => {
    try {
      const res = await fetch("/api/telnyx/all-model");
      const data = await res.json();
      setModel(data || []);
      // console.log(model);
    } catch (error) {
      console.log("failed to get Model List");
    }
  };

  // Fetch Phone
  const getPhone = async () => {
    try {
      const res = await fetch("/api/telnyx/all-phone");
      const data = await res.json();
      console.log(data);
      setPhone(data || []);
      // console.log(phone);
    } catch (error) {
      console.log("failed to get Model List");
    }
  };
  useEffect(() => {
    fetchAssistants();
    getModel();
    getPhone();
  }, []);

  // Create Agent
  const createAssistant = async () => {
    if (value && selectedModel) {
      setLoading(true);
      try {
        const res = await fetch("/api/telnyx/create-assistants", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: value,
            instructions: "These are the instructions for the new assistant",
            model: selectedModel,
          }),
        });

        const data = await res.json();
        console.log(data);
        if (data.id) {
          // alert(`Assistant created! ID: ${data.id}`);
          await fetchAssistants();
        } else {
          alert("Error creating assistant");
        }
      } catch (error) {
        console.error("Failed to create assistant:", error);
        alert("Failed to create assistant");
      } finally {
        setLoading(false);
      }
    } else {
      alert("input field empty");
      return;
    }
  };

  // Delete Agent
  const deleteAssistant = async (id: string) => {
    try {
      const res = await fetch("/api/telnyx/delete-assistants", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id }),
      });
      const data = await res.json();
      if (data) {
        // alert("agent is deleted");
        await fetchAssistants();
      }
    } catch (error) {
      alert("failed to delete");
    }
  };

  // Update Agent
  const UpdateAssistant = async (list: Assistant) => {
    setLoading(true);
    try {
      // console.log(list);
      const res = await fetch("/api/telnyx/update-assistants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(list),
      });
      const data = await res.json();
      if (data) {
        // alert("agent is deleted");
        setLoading(false);
        setUpdateBox(false);
        await fetchAssistants();
      }
    } catch (error) {
      alert("failed to delete");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ padding: "2rem" }}>
        <h1 className="text-5xl font-bold text-center pb-10">
          Telnyx Assistants
        </h1>
        <div className="flex flex-col justify-center gap-5 p-5 border w-96">
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Agent Name</label>
            <input
              className="outline outline-2 outline-[#ddd]"
              id="name"
              type="text"
              placeholder="Name"
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="model">Model</label>
            <select
              id="model"
              className="outline outline-2 outline-[#ddd]"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              <option value="">Select options</option>
              {model.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.id}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="phone">Phone</label>
            <select
              id="phone"
              className="outline outline-2 outline-[#ddd]"
              value={selectedPhone}
              onChange={(e) => setSelectedPhone(e.target.value)}
            >
              <option value="">Select options</option>
              {phone.map((e) => (
                <option key={e.phone_number} value={e.phone_number}>
                  {e.phone_number}
                </option>
              ))}
            </select>
          </div>

          <button
            className="p-2 border-2"
            disabled={loading}
            onClick={createAssistant}
            style={{ padding: "0.5rem 1rem" }}
          >
            {loading ? "Creating..." : "Create Agent"}
          </button>
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "1rem",
          }}
        >
          <thead>
            <tr>
              <th className="outline outline-1 outline-[#ddd] p-2">ID</th>
              <th className="outline outline-1 outline-[#ddd] p-2">Name</th>
              {/* <th className="outline outline-1 outline-[#ddd] p-2">
                Description
              </th> */}
              <th className="outline outline-1 outline-[#ddd] p-2">Model</th>
              <th className="outline outline-1 outline-[#ddd] p-2">Status</th>
              <th className="outline outline-1 outline-[#ddd] p-2">
                Created At
              </th>
              <th className="outline outline-1 outline-[#ddd] p-2"></th>
            </tr>
          </thead>
          <tbody>
            {assistants.map((assistant) => (
              <tr key={assistant.id}>
                <td
                  className="outline outline-1 outline-[#ddd] p-2"
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "22ch",
                  }}
                >
                  {assistant.id}
                </td>
                <td className="outline outline-1 outline-[#ddd] p-2">
                  {assistant.name}
                </td>
                {/* <td className="outline outline-1 outline-[#ddd] p-2">
                  {assistant.description || "N/A"}
                </td> */}
                <td
                  className="outline outline-1 outline-[#ddd] p-2"
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "11ch",
                  }}
                >
                  {assistant.model || "N/A"}
                </td>
                <td className="outline outline-1 outline-[#ddd] p-2">
                  {assistant.status || "N/A"}
                </td>
                <td
                  className="outline outline-1 outline-[#ddd] p-2"
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "17.5ch",
                  }}
                >
                  {assistant.created_at
                    ? new Date(assistant.created_at).toLocaleString()
                    : "N/A"}
                </td>
                <td className="outline outline-1 outline-[#ddd] p-2 flex gap-2">
                  <button
                    className="p-2 border-2 text-white bg-green-500"
                    onClick={() => {
                      setUpdateBox(true);
                      setUpdateAgent(assistant);
                    }}
                  >
                    Update
                  </button>
                  <button
                    className="p-2 border-2 text-white bg-rose-500"
                    onClick={() => {
                      deleteAssistant(assistant.id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {updateBox && (
        <div className="absolute top-0 left-0 bg-black/75 w-full h-full flex justify-center items-center">
          <div className="flex flex-col justify-center gap-5 p-5 border w-96 bg-white relative">
            <div
              className=" cursor-pointer absolute top-5 right-5"
              onClick={() => {
                setUpdateBox(false);
              }}
            >
              X
            </div>
            <h2 className="text-3xl text-center">Update Agent</h2>
            <div className="flex flex-col gap-1">
              <label htmlFor="name">Agent Name</label>
              <input
                className="outline outline-2 outline-[#ddd]"
                id="name"
                type="text"
                value={updateAgent?.name || ""}
                placeholder="Name"
                onChange={(e) =>
                  setUpdateAgent((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="model">Model</label>
              <select
                id="model"
                className="outline outline-2 outline-[#ddd]"
                value={selectedModel}
                onChange={(e) =>
                  setUpdateAgent((prev) =>
                    prev ? { ...prev, model: e.target.value } : null
                  )
                }
              >
                <option value="">Select options</option>
                {model.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.id}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="phone">Phone</label>
              <select
                id="phone"
                className="outline outline-2 outline-[#ddd]"
                value={selectedPhone}
                onChange={(e) => setSelectedPhone(e.target.value)}
              >
                <option value="">Select options</option>
                {phone.map((e) => (
                  <option key={e.phone_number} value={e.phone_number}>
                    {e.phone_number}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="p-2 border-2"
              disabled={loading}
              onClick={() => {
                if (updateAgent) UpdateAssistant(updateAgent);
              }}
              style={{ padding: "0.5rem 1rem" }}
            >
              {loading ? "Update..." : "Update Agent"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
