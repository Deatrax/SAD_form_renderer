import React, { useState } from "react";
import FormRenderer from "./components/FormRenderer";
import forms from "./data/forms.json";

export default function App() {
  const [selectedFormId, setSelectedFormId] = useState(forms[0].id);

  return (
    <div>      
      <select className="ml-[450px] mt-10 absolute p-2 bg-slate-200 rounded-md" value={selectedFormId} onChange={(e) => setSelectedFormId(e.target.value)}>
        {forms.map((f) => (
          <option key={f.id} value={f.id}>
            {f.id}
          </option>
        ))}
      </select>

      <FormRenderer formId={selectedFormId} />
    </div>
  );
}
