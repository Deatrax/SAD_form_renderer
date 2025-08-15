import React from "react";
//import "./formStyles.css"; // Shared CSS

export default function FormTypeA({ title, sections }) {
  return (
    <div className="flex flex-col gap-4 max-w-[800px] mx-auto mt-6 border border-blue-600 px-4 py-4">
      <h2 className="text-3xl font-bold text-blue-600">{title}</h2>

      {/* Header Section */}
      <div className="">
        {sections.header.map((item, idx) => (
          <div className="flex flex-row gap-10" key={idx}>
            <label className="font-bold w-20">{item.label}</label>
            <div className="">{item.value}</div>
          </div>
        ))}
      </div>
        <hr></hr>
      {/* Characteristics */}
      <h3 className="text-xl font-bold text-blue-500">Element Characteristics</h3>
      <div className="flex flex-col gap-1">
        <div><span className="font-bold">Length:</span> {sections.characteristics.length}</div>
        <div><span className="font-bold">Input Format:</span> {sections.characteristics.inputFormat}</div>
        <div><span className="font-bold">Output Format:</span> {sections.characteristics.outputFormat}</div>
        <div><span className="font-bold">Default Value:</span> {sections.characteristics.defaultValue}</div>

        <div className="flex flex-col">
          {Object.entries(sections.characteristics.flags).map(([key, val]) => (
            <label key={key}>
              <input type="checkbox" checked={val} readOnly /> {key}
            </label>
          ))}
        </div>
      </div>
          <hr></hr>
      {/* Validation */}
      <h3 className="text-xl font-bold text-blue-500">Validation Criteria</h3>
      <table className="text-center table-auto border">
        <thead>
          <tr>
            <th className="border py-2">Limit</th>
            <th className="border py-2">Continuous</th>
            <th className="border py-2">Discrete</th>
            <th className="border py-2">Meaning</th>
          </tr>
        </thead>
        <tbody>
          {sections.validation.rows.map((v, idx) => (
            <tr key={idx}>
              <td className="border py-2">{v.limit}</td>
              <td className="border py-2">{v.continuous}</td>
              <td className="border py-2">{v.discrete}</td>
              <td className="border py-2">{v.meaning}</td>
            </tr>
          ))}
        </tbody>
      </table>
          <hr></hr>
      {/* Comments */}
      <div className="text-lg">
        <strong>Comments:</strong> {sections.comments}
      </div>
    </div>
  );
}
