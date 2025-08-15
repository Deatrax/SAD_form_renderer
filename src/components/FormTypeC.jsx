import React from "react";
//import "./formStyles.css"; // Shared CSS

export default function FormTypeC({ title, sections }) {
  return (
    <div className="flex flex-col gap-4 w-[800px] mx-auto mt-6 border border-blue-600 px-4 py-4">
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
      <h3 className="text-xl font-bold text-blue-500">Data Store Characteristics</h3>
      <div className="flex flex-col gap-1">
        <div><span className="font-bold">File Type:</span> {sections.characteristics.fileType}</div>
        <div><span className="font-bold">File Format:</span> {sections.characteristics.fileFormat}</div>
        <div><span className="font-bold">Record Size:</span> {sections.characteristics.recordSize}</div>
        <div><span className="font-bold">Number of Records:</span> {sections.characteristics.numRecords}</div>
        <div><span className="font-bold">Average:</span> {sections.characteristics.average}</div>
        <div><span className="font-bold">Percentage annual growth:</span> {sections.characteristics.percentageGrowth}</div>
        <div><span className="font-bold">Block Size:</span> {sections.characteristics.blockSize}</div>
        <div className="flex flex-row gap-4">
            {Object.entries(sections.characteristics.flags1).map(([key, val]) => (
              <label key={key}>
                <input type="checkbox" checked={val} readOnly /> {key}
              </label>
            ))}
        </div>
        <hr className="my-1"></hr>
        <div><span className="font-bold">Data Set Name:</span> {sections.characteristics.dataSetName}</div>
        <div><span className="font-bold">Copy Member:</span> {sections.characteristics.copyMember}</div>
        <div><span className="font-bold">Structure:</span> {sections.characteristics.structure}</div>
        <div><span className="font-bold">Primary Key:</span> {sections.characteristics.primaryKey}</div>
        <div><span className="font-bold">Secondary Keys:</span></div>
        <ul className="flex flex-row gap-4">
          {sections.characteristics.secondaryKey.map((item, index) => (
            <li key={index}>{`${index+1}. ${item}`}</li>
          ))}
        </ul>
      </div>
      
      <hr></hr>
      {/* Comments */}
      <div className="text-lg">
        <strong>Comments:</strong> {sections.comments}
      </div>
    </div>
  );
}
