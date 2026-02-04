import { useEffect, useState } from "react";
import "../app/globals.css";

interface Assistant {
  id: string;
  name: string;
  description?: string;
  model?: string;
  status?: string;
  instructions?: string;
  greeting?: string;
  created_at?: string;
  updated_at?: string;
  telephony_settings: {
    default_texml_app_id: string;
  };
  transcription: {
    model: string;
  };
}

interface Model {
  id: string;
}

interface Phone {
  id: string;
  phone_number: string;
  phone_number_type: string;
  connection_id: string | null;
  cost_information: {
    monthly_cost: string[];
  };
  phone_numbers: {
    phone_number: string;
    phone_number_type: string;
  }[];
}

export default function AssistantsTable() {
  const [value, setValue] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedGreeting, setSelectedGreeting] = useState<string>("");
  const [instructions, setinstructions] = useState<string>("");
  const [tranmodel, settranmodel] = useState<string>("");
  const [tool, setTool] = useState<string>("");
  const [selectedPhone, setSelectedPhone] = useState<string>("");
  const [selectedBuyPhone, setSelectedBuyPhone] = useState<string>("");

  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [model, setModel] = useState<Model[]>([]);
  const [phone, setPhone] = useState<Phone[]>([]);
  const [buyPhone, setBuyPhone] = useState<Phone[]>([]);
  const [fetchApp, setFetchApp] = useState<Phone[]>([]);

  const [updateAgent, setUpdateAgent] = useState<Assistant | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [updateBox, setUpdateBox] = useState<boolean>(false);

  //
  // Fetch
  //

  // Agent List
  async function fetchAssistants() {
    try {
      const res = await fetch("/api/telnyx/all-assistants");
      const data = await res.json();
      console.log(data);
      setAssistants(data || []);
    } catch (error) {
      console.error("Failed to fetch assistants:", error);
    }
  }

  // Fetch Model
  const fetchModel = async () => {
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
  const fetchPhone = async () => {
    try {
      const res = await fetch("/api/telnyx/all-phone");
      const data = await res.json();
      console.log(data);
      setPhone(data || []);
      // console.log(phone);
    } catch (error) {
      console.log("failed to get Phone List");
    }
  };

  // Fetch Buy Phone
  const fetchBuyPhone = async () => {
    try {
      const res = await fetch("/api/telnyx/buy-phone");
      const data = await res.json();
      // console.log(data);
      setBuyPhone(data || []);
      // console.log(phone);
    } catch (error) {
      console.log("failed to get Phone List");
    }
  };

  // Fetch Telephony App
  const fetchtelephonyapp = async () => {
    try {
      const res = await fetch("/api/telnyx/all-telephony-app");
      const data = await res.json();
      console.log(data);
      setFetchApp(data || []);
    } catch (error) {
      console.log("failed to get Telephony App List");
    }
  };
  useEffect(() => {
    fetchAssistants();
    fetchModel();
    fetchPhone();
    fetchBuyPhone();
    fetchtelephonyapp();
  }, []);

  // assignNumber("2887807342852703572", "2883598549705033352"); // Free Quotet
  // assignNumber("2816285045436712138", "2883598549705033352"); // SJ Sales Agent

  // Create Agent
  const createAssistant = async () => {
    if (value && selectedModel && selectedGreeting && instructions) {
      setLoading(true);
      try {
        const res = await fetch("/api/telnyx/create-assistants", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: value,
            instructions: instructions,
            model: selectedModel,
            greeting: selectedGreeting,
            enabled_features: ["telephony"],
            transcription: {
              model: tranmodel,
            },
          }),
        });

        const data = await res.json();
        console.log(data);
        await fetchAssistants();
        await fetchtelephonyapp();
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
  const deleteAssistant = async (id: string, app_id: string) => {
    try {
      const res = await fetch("/api/telnyx/delete-assistants", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id, app_id: app_id }),
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

  // Delete App
  const deleteapp = async (id: string) => {
    try {
      const res = await fetch("/api/telnyx/delete-app", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id }),
      });
      const data = await res.json();
      if (data) {
        // alert("agent is deleted");
        await fetchtelephonyapp();
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
      alert("failed to update");
    } finally {
      setLoading(false);
    }
  };

  // assign Number
  async function assignNumber(assistantId: string, numberId: string) {
    setLoading(true);
    try {
      await fetch("/api/telnyx/assign-number", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assistantId, numberId }),
      });
      await fetchAssistants();
      await fetchPhone();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div style={{ padding: "2rem" }}>
        <h1 className="text-5xl font-bold text-center pb-10">
          Telnyx Assistants
        </h1>
        <div className="flex flex-row gap-5">
          {/* Create Agent */}
          <div className="flex flex-col gap-5 p-4 border w-96 bg-white relative rounded-lg">
            <h2 className="text-2xl">Creating Agent</h2>
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
              <label htmlFor="Instructions">Instructions</label>
              <textarea
                className="outline outline-2 outline-[#ddd]"
                id="Instructions"
                cols="30"
                rows="5"
                placeholder="Name"
                onChange={(e) => setinstructions(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="greeting">greeting</label>
              <input
                className="outline outline-2 outline-[#ddd]"
                id="greeting"
                type="text"
                placeholder="Name"
                onChange={(e) => setSelectedGreeting(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="tranmodel">transcription Model</label>
              <select
                id="tranmodel"
                className="outline outline-2 outline-[#ddd]"
                value={tranmodel}
                onChange={(e) => settranmodel(e.target.value)}
              >
                <option value="">Select options</option>
                <option value="deepgram/flux">deepgram/flux</option>
                <option value="distil-whisper/distil-large-v2">
                  distil-whisper/distil-large-v2
                </option>
                <option value="openai/whisper-large-v3-turbo">
                  openai/whisper-large-v3-turbo
                </option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="tool">Tools</label>
              <select
                className="outline outline-2 outline-[#ddd]"
                value={tool}
                onChange={(e) => setTool(e.target.value)}
              >
                <option value="">Select Tool</option>
                <option value="hangup">Hangup</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>
            {tool == "hangup" && (
              <div>
                <h2 className="text-xl text-center">hangup</h2>
                <div className="flex flex-col gap-1">
                  <label htmlFor="description">description</label>
                  <input
                    className="outline outline-2 outline-[#ddd]"
                    id="description"
                    type="text"
                    placeholder="Name"
                    onChange={(e) => setValue(e.target.value)}
                  />
                </div>
              </div>
            )}

            <button
              className="p-2 border-2"
              disabled={loading}
              onClick={createAssistant}
              style={{ padding: "0.5rem 1rem" }}
            >
              {loading ? "Creating..." : "Create Agent"}
            </button>
          </div>
        </div>

        <h1 className="py-10 text-center text-5xl font-bold"> Agent list</h1>
        <table className="w-full mt-[1rem] border-collapse">
          <thead>
            <tr>
              <th className="outline outline-1 outline-[#ddd] p-2">ID</th>
              <th className="outline outline-1 outline-[#ddd] p-2">Name</th>
              <th className="outline outline-1 outline-[#ddd] p-2">Model</th>
              <th className="outline outline-1 outline-[#ddd] p-2">Status</th>
              <th className="outline outline-1 outline-[#ddd] p-2">App id</th>
              <th className="outline outline-1 outline-[#ddd] p-2">
                Created At
              </th>
              <th className="outline outline-1 outline-[#ddd] p-2"></th>
            </tr>
          </thead>
          <tbody>
            {assistants.map((assistant) => (
              <tr key={assistant.id}>
                <td className="outline outline-1 outline-[#ddd] p-2 max-w-[22ch] overflow-hidden whitespace-nowrap text-ellipsis">
                  {assistant.id}
                </td>
                <td className="outline outline-1 outline-[#ddd] p-2">
                  {assistant.name}
                </td>
                <td className="outline outline-1 outline-[#ddd] p-2 max-w-[11ch] overflow-hidden whitespace-nowrap text-ellipsis">
                  {assistant.model || "N/A"}
                </td>
                <td className="outline outline-1 outline-[#ddd] p-2">
                  {assistant.status || "N/A"}
                </td>
                <td className="outline outline-1 outline-[#ddd] p-2">
                  {assistant.telephony_settings.default_texml_app_id || "N/A"}
                </td>
                <td className="outline outline-1 outline-[#ddd] p-2 max-w-[17.5ch] overflow-hidden whitespace-nowrap text-ellipsis">
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
                      deleteAssistant(
                        assistant.id,
                        assistant.telephony_settings.default_texml_app_id
                      );
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h1 className="py-10 text-center text-5xl font-bold "> App list</h1>
        <table className="w-full mt-[1rem] border-collapse ">
          <thead>
            <tr>
              <th className="outline outline-1 outline-[#ddd] p-2">ID</th>
              <th className="outline outline-1 outline-[#ddd] p-2">name</th>
              <th className="outline outline-1 outline-[#ddd] p-2">Status</th>
              <th className="outline outline-1 outline-[#ddd] p-2">
                Anchorsite Override
              </th>
              <th className="outline outline-1 outline-[#ddd] p-2">
                Created At
              </th>
            </tr>
          </thead>
          <tbody>
            {fetchApp.map((ph) => (
              <tr key={ph.id}>
                <td className="outline outline-1 outline-[#ddd] p-2 max-w-[22ch] overflow-hidden whitespace-nowrap text-ellipsis">
                  {ph.id}
                </td>
                <td className="outline outline-1 outline-[#ddd] p-2 max-w-[22ch] overflow-hidden whitespace-nowrap text-ellipsis">
                  {ph.friendly_name || "N/A"}
                </td>
                <td className="outline outline-1 outline-[#ddd] p-2">
                  {ph.status || "N/A"}
                </td>
                <td className="outline outline-1 outline-[#ddd] p-2">
                  {ph.anchorsite_override || "N/A"}
                </td>
                <td className="outline outline-1 outline-[#ddd] p-2 max-w-[17.5ch] overflow-hidden whitespace-nowrap text-ellipsis">
                  {ph.created_at
                    ? new Date(ph.created_at).toLocaleString()
                    : "N/A"}
                </td>
                <td className="outline outline-1 outline-[#ddd] p-2 hidden">
                  <button
                    className="p-2 border-2 text-white bg-red-500"
                    onClick={() => {
                      deleteapp(ph.id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h1 className="py-10 text-center text-5xl font-bold"> Phone list</h1>
        <table className="w-full mt-[1rem] border-collapse">
          <thead>
            <tr>
              <th className="outline outline-1 outline-[#ddd] p-2">ID</th>
              <th className="outline outline-1 outline-[#ddd] p-2">
                connection id
              </th>
              <th className="outline outline-1 outline-[#ddd] p-2">
                connection name
              </th>
              <th className="outline outline-1 outline-[#ddd] p-2">Status</th>
              <th className="outline outline-1 outline-[#ddd] p-2">
                Phone Number
              </th>
              <th className="outline outline-1 outline-[#ddd] p-2">
                Created At
              </th>
            </tr>
          </thead>
          <tbody>
            {phone
              .filter((ph) => new Date(ph.created_at) > new Date("2026-01-14"))
              .map((ph) => (
                <tr key={ph.id}>
                  <td className="outline outline-1 outline-[#ddd] p-2 max-w-[22ch] overflow-hidden whitespace-nowrap text-ellipsis">
                    {ph.id}
                  </td>
                  <td className="outline outline-1 outline-[#ddd] p-2">
                    {ph.connection_id || "N/A"}
                  </td>
                  <td className="outline outline-1 outline-[#ddd] p-2 max-w-[11ch] overflow-hidden whitespace-nowrap text-ellipsis">
                    {ph.connection_name || "N/A"}
                  </td>
                  <td className="outline outline-1 outline-[#ddd] p-2">
                    {ph.status || "N/A"}
                  </td>
                  <td className="outline outline-1 outline-[#ddd] p-2">
                    {ph.phone_number || "N/A"}
                  </td>
                  <td className="outline outline-1 outline-[#ddd] p-2 max-w-[17.5ch] overflow-hidden whitespace-nowrap text-ellipsis">
                    {ph.created_at
                      ? new Date(ph.created_at).toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {updateBox && (
        <div className=" fixed top-0 left-0 w-full h-full">
          <div className=" bg-black/75 w-full h-full flex justify-center items-center">
            <div className="flex flex-col justify-center gap-5 p-4 border min-w-96 w-full max-w-[90%] bg-white relative rounded-lg">
              <div
                className="cursor-pointer absolute top-1 right-1 text-white bg-black px-2 py-1 rounded-md"
                onClick={() => setUpdateBox(false)}
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
                  value={updateAgent?.model || ""}
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
                <label htmlFor="greeting">Instructions</label>
                <textarea
                  className="outline outline-2 outline-[#ddd]"
                  name=""
                  id="greeting"
                  cols="20"
                  rows="5"
                  value={updateAgent?.instructions || ""}
                  placeholder="Instructions"
                  onChange={(e) =>
                    setUpdateAgent((prev) =>
                      prev ? { ...prev, instructions: e.target.value } : null
                    )
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="greeting">greeting</label>
                <input
                  className="outline outline-2 outline-[#ddd]"
                  id="greeting"
                  type="text"
                  value={updateAgent?.greeting || ""}
                  placeholder="Name"
                  onChange={(e) =>
                    setUpdateAgent((prev) =>
                      prev ? { ...prev, greeting: e.target.value } : null
                    )
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="tranmodel">transcription Model</label>
                <select
                  id="tranmodel"
                  className="outline outline-2 outline-[#ddd]"
                  value={updateAgent?.transcription?.model || ""}
                  onChange={(e) =>
                    setUpdateAgent((prev) =>
                      prev
                        ? {
                            ...prev,
                            transcription: {
                              ...prev.transcription, // keep other transcription fields
                              model: e.target.value, // update only model
                            },
                          }
                        : null
                    )
                  }
                >
                  <option value="">Select options</option>
                  <option value="deepgram/flux">deepgram/flux</option>
                  <option value="distil-whisper/distil-large-v2">
                    distil-whisper/distil-large-v2
                  </option>
                  <option value="openai/whisper-large-v3-turbo">
                    openai/whisper-large-v3-turbo
                  </option>
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
        </div>
      )}
    </>
  );
}
