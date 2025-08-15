import React from "react";
//import "./formStyles.css"; // Shared CSS

export default function FormTypeB({ title, sections }) {
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

      {/* Characteristics */}
      <hr></hr>
      <div className="flex flex-col gap-1">
        <div><span className="font-bold">Source:</span> {sections.characteristics.source}</div>
        <div><span className="font-bold">Destination:</span> {sections.characteristics.destination}</div>
        <div><span className="font-bold">Data structure travelling with the flow:</span> {sections.characteristics.structure}</div>
        <div><span className="font-bold">Volume/time:</span> {sections.characteristics.volume}</div>
      </div>
      <hr></hr>
      <div><span className="font-bold">Type of data flow: </span></div>
        <div className="flex flex-col">
          {Object.entries(sections.characteristics.flags).map(([key, val]) => (
            <label key={key}>
              <input type="checkbox" checked={val} readOnly /> {key}
            </label>
          ))}
        </div>
      <hr></hr>

      {/* Comments */}
      <div className="text-lg">
        <strong>Comments:</strong> {sections.comments}
      </div>
    </div>
  );
}
