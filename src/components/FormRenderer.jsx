import React from "react";
import forms from "../data/forms.json";
import FormTypeA from "./FormTypeA";
import FormTypeB from "./FormTypeB";
import FormTypeC from "./FormTypeC";

const templates = {
  A: FormTypeA,
  B: FormTypeB,
  C: FormTypeC
};

export default function FormRenderer({ formId }) {
  const formData = forms.find(f => f.id === formId);
  if (!formData) return <p>Form not found.</p>;

  const Component = templates[formData.type];
  return <Component {...formData} />;
}
