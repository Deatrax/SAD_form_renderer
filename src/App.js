import React, { useState, useRef } from 'react';
import { Download, Plus, Trash2, Edit3, Eye, Code, Save } from 'lucide-react';

const DynamicSADFormBuilder = () => {
  const [currentView, setCurrentView] = useState('preview');
  const [selectedForm, setSelectedForm] = useState('A');
  
  // Sample form configurations matching the original SAD forms
  const [formConfigs, setFormConfigs] = useState({
    A: {
      formId: 'A1',
      title: 'Element Description Form',
      fields: {
        name: 'Member ID',
        alias: ['Student ID', 'IUT ID Number'],
        description: 'Unique identifier for each registered IUTCS member, matching their official IUT-issued Student ID; links all system records to the correct member profile.',
        elementCharacteristics: {
          length: '9',
          inputFormat: '999999999',
          outputFormat: '999999999',
          defaultValue: ''
        },
        dataTypes: {
          alphabetic: false,
          alphanumeric: false,
          date: false,
          numeric: true,
          continuous: false,
          discrete: true,
          base: true,
          derived: false
        },
        validationCriteria: {
          upper: [
            { discrete: '9-digit format', meaning: 'Exactly 9 digits, no spaces or letters' },
            { discrete: 'Exists in DB', meaning: 'Must exist in Member Record database' }
          ],
          lower: []
        },
        comments: 'Member ID must already exist in the official IUT Student Record system. Fixed length ensures faster searching, validation, and matching of records.'
      }
    },
    B: {
      formId: 'B1',
      title: 'Data Flow Description',
      fields: {
        id: 'DF-01',
        name: 'Task Assignment Request',
        description: 'Contains details of tasks assigned by the Team Lead, including task title, description, assignee(s), deadlines, and priority level, which will be stored and tracked in the Task Database.',
        source: 'Team Lead',
        destination: 'Assign Tasks (Process 1 in Diagram 0)',
        dataStructure: 'Task Details',
        volumeTime: '5-8 assignments per event cycle',
        dataFlowTypes: {
          discrete: false,
          screen: true,
          report: false,
          form: false,
          internal: false
        },
        comments: 'Task assignment requests are submitted through the system\'s executive dashboard interface. Upon submission, the data is validated, assigned a unique task_id, and stored in the Task Database. The process also triggers downstream flows for notifications and task monitoring.'
      }
    },
    C: {
      formId: 'C1',
      title: 'Data Store Description Form',
      fields: {
        id: 'D1',
        name: 'Task Database',
        alias: ['Task DB', 'Assignment Records'],
        description: 'Contains a record for each task assigned within IUTCS. Stores task header details (task_id, title, description, creator, create date, due date/time, priority, status) and links to assigned members and notifications. Used by Processes 1 (Assign Tasks), 2 (View & Complete Task), and 4 (Notify) in DFD-0.',
        dataStoreCharacteristics: {
          fileType: 'Computer',
          fileFormat: 'Database',
          recordSize: '720',
          numberOfRecords: '10000 (Maximum)',
          average: '2000',
          percentageAnnualGrowth: '15%',
          blockSize: '4096'
        },
        accessTypes: {
          manual: false,
          indexed: true,
          sequential: false,
          direct: true
        },
        dataSetName: 'Task.MST',
        copyMember: 'TaskMaster',
        structure: 'Task Assignment Request',
        primaryKey: 'Task ID',
        secondaryKeys: ['Member Id', 'Due date', 'Status', 'Priority Level'],
        comments: 'Active records retained for 3 academic years, then archived to history storage. Weekly incremental and monthly full backups recommended. Edit access limited to Executive/Team Leads and System Admin; members have read/update status on tasks assigned to them. Indices on (member_id) and (due_date, status) support reminders and dashboards.'
      }
    }
  });

  const [jsonEditor, setJsonEditor] = useState('');
  const formRef = useRef(null);

  // Initialize JSON editor when switching to code view
  React.useEffect(() => {
    if (currentView === 'code') {
      setJsonEditor(JSON.stringify(formConfigs, null, 2));
    }
  }, [currentView, formConfigs]);

  const exportToPNG = async () => {
    if (!formRef.current) return;
    
    try {
      const element = formRef.current;
      const printWindow = window.open('', '_blank');
      const currentConfig = formConfigs[selectedForm];
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>SAD Form - ${currentConfig.title}</title>
            <style>
              * { box-sizing: border-box; margin: 0; padding: 0; }
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', Arial, sans-serif;
                line-height: 1.4;
                color: #000;
                background: white;
                padding: 20px;
              }
              .form-container {
                max-width: 800px;
                margin: 0 auto;
                border: 2px solid #3b82f6;
                border-radius: 8px;
                padding: 24px;
                background: white;
                position: relative;
              }
              .form-id-badge {
                position: absolute;
                top: 8px;
                left: 8px;
                padding: 4px 8px;
                border: 2px solid #3b82f6;
                border-radius: 4px;
                background: white;
                color: #3b82f6;
                font-weight: bold;
                font-size: 14px;
              }
              .form-title {
                color: #3b82f6;
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 24px;
                margin-top: 32px;
                text-align: left;
              }
              .section-title {
                color: #3b82f6;
                font-size: 18px;
                font-weight: bold;
                margin: 24px 0 16px 0;
              }
              .field-row {
                display: flex;
                margin-bottom: 12px;
                align-items: flex-start;
              }
              .field-label {
                font-weight: bold;
                min-width: 160px;
                margin-right: 20px;
                flex-shrink: 0;
              }
              .field-value {
                flex: 1;
                word-wrap: break-word;
              }
              .checkbox-group {
                margin-left: 180px; /* Aligned with field values */
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 8px;
              }
              .checkbox-item {
                display: flex;
                align-items: center;
                margin-bottom: 4px;
              }
              .checkbox {
                width: 16px;
                height: 16px;
                border: 2px solid #333;
                margin-right: 8px;
                position: relative;
                flex-shrink: 0;
              }
              .checkbox.checked {
                background: #3b82f6;
                border-color: #3b82f6;
              }
              .checkbox.checked::after {
                content: '✓';
                position: absolute;
                color: white;
                font-size: 12px;
                top: -2px;
                left: 2px;
              }
              .validation-table {
                width: 100%;
                border-collapse: collapse;
                margin: 16px 0;
              }
              .validation-table th, .validation-table td {
                border: 1px solid #333;
                padding: 8px;
                text-align: left;
                vertical-align: top;
              }
              .validation-table th {
                background: #f5f5f5;
                font-weight: bold;
              }
              .space-y-6 > * + * { margin-top: 24px; }
              .space-y-2 > * + * { margin-top: 8px; }
              hr {
                border: none;
                border-top: 2px solid #dbeafe; /* light blue */
                margin: 24px 0;
              }
              @media print {
                body { margin: 0; padding: 10px; }
                .form-container { border: 1px solid #000; }
              }
            </style>
          </head>
          <body>
            <div class="form-container">
              <div class="form-id-badge">${currentConfig.formId}</div>
              <div class="form-title">${currentConfig.title}</div>
              ${generatePrintContent(currentConfig, selectedForm)}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 1000);
      
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try using your browser\'s print function.');
    }
  };

  const generatePrintContent = (config, formType) => {
    const { fields } = config;
    
    if (formType === 'A') {
      return `
        <div class="space-y-6">
          <div class="space-y-2">
            <div class="field-row">
              <span class="field-label">Name</span>
              <span class="field-value">${fields.name}</span>
            </div>
            ${fields.alias.map(alias => `
              <div class="field-row">
                <span class="field-label">Alias</span>
                <span class="field-value">${alias}</span>
              </div>
            `).join('')}
            <div class="field-row">
              <span class="field-label">Description</span>
              <span class="field-value">${fields.description}</span>
            </div>
          </div>

          <div>
            <hr />
            <div class="section-title">Element Characteristics</div>
            <div class="space-y-2">
              ${Object.entries(fields.elementCharacteristics).map(([key, value]) => `
                <div class="field-row">
                  <span class="field-label">${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                  <span class="field-value">${value}</span>
                </div>
              `).join('')}
            </div>
            
            <div class="field-row" style="margin-top: 16px;">
              <span class="field-label"></span>
              <div class="checkbox-group">
                ${Object.entries(fields.dataTypes).map(([type, checked]) => `
                  <div class="checkbox-item">
                    <div class="checkbox ${checked ? 'checked' : ''}"></div>
                    <span>${type.charAt(0).toUpperCase() + type.slice(1)}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <div>
            <hr />
            <div class="section-title">Validation Criteria</div>
            <table class="validation-table">
              <thead>
                <tr>
                  <th>Limit</th>
                  <th>Continuous</th>
                  <th>Discrete</th>
                  <th>Meaning</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Upper</strong></td>
                  <td></td>
                  <td>${fields.validationCriteria.upper.map(item => `<div>${item.discrete}</div>`).join('')}</td>
                  <td>${fields.validationCriteria.upper.map(item => `<div>${item.meaning}</div>`).join('')}</td>
                </tr>
                <tr>
                  <td><strong>Lower</strong></td>
                  <td></td>
                  <td>${fields.validationCriteria.lower.map(item => `<div>${item.discrete}</div>`).join('')}</td>
                  <td>${fields.validationCriteria.lower.map(item => `<div>${item.meaning}</div>`).join('')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <div class="field-row">
              <span class="field-label">Comments</span>
              <span class="field-value">${fields.comments}</span>
            </div>
          </div>
        </div>
      `;
    } else if (formType === 'B') {
      // ... (unchanged)
      return `
        <div class="space-y-6">
          <div class="space-y-2">
            ${['id', 'name', 'description', 'source', 'destination', 'dataStructure', 'volumeTime'].map(field => `
              <div class="field-row">
                <span class="field-label">${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                <span class="field-value">${fields[field]}</span>
              </div>
            `).join('')}
          </div>

          <div>
            <div class="field-row">
              <span class="field-label">Type of data flow:</span>
              <div class="checkbox-group">
                ${Object.entries(fields.dataFlowTypes).map(([type, checked]) => `
                  <div class="checkbox-item">
                    <div class="checkbox ${checked ? 'checked' : ''}"></div>
                    <span>${type}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <div>
            <div class="field-row">
              <span class="field-label">Comments</span>
              <span class="field-value">${fields.comments}</span>
            </div>
          </div>
        </div>
      `;
    } else if (formType === 'C') {
      // ... (unchanged)
      return `
        <div class="space-y-6">
          <div class="space-y-2">
            <div class="field-row">
              <span class="field-label">ID</span>
              <span class="field-value">${fields.id}</span>
            </div>
            <div class="field-row">
              <span class="field-label">Name</span>
              <span class="field-value">${fields.name}</span>
            </div>
            <div class="field-row">
              <span class="field-label">Alias</span>
              <span class="field-value">${fields.alias.join(', ')}</span>
            </div>
            <div class="field-row">
              <span class="field-label">Description</span>
              <span class="field-value">${fields.description}</span>
            </div>
          </div>

          <div>
            <div class="section-title">Data Store Characteristics</div>
            <div class="space-y-2">
              ${Object.entries(fields.dataStoreCharacteristics).map(([key, value]) => `
                <div class="field-row">
                  <span class="field-label">${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                  <span class="field-value">${value}</span>
                </div>
              `).join('')}
            </div>
            
            <div class="field-row" style="margin-top: 16px;">
              <span class="field-label">Access Types:</span>
              <div class="checkbox-group">
                ${Object.entries(fields.accessTypes).map(([type, checked]) => `
                  <div class="checkbox-item">
                    <div class="checkbox ${checked ? 'checked' : ''}"></div>
                    <span>${type}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <div class="field-row">
              <span class="field-label">Data Set Name</span>
              <span class="field-value">${fields.dataSetName}</span>
            </div>
            <div class="field-row">
              <span class="field-label">Copy Member</span>
              <span class="field-value">${fields.copyMember}</span>
            </div>
            <div class="field-row">
              <span class="field-label">Structure</span>
              <span class="field-value">${fields.structure}</span>
            </div>
            <div class="field-row">
              <span class="field-label">Primary Key</span>
              <span class="field-value">${fields.primaryKey}</span>
            </div>
            <div class="field-row">
              <span class="field-label">Secondary Keys</span>
              <div class="field-value">
                ${fields.secondaryKeys.map((key, idx) => `<div>${idx + 1}. ${key}</div>`).join('')}
              </div>
            </div>
          </div>

          <div>
            <div class="field-row">
              <span class="field-label">Comments</span>
              <span class="field-value">${fields.comments}</span>
            </div>
          </div>
        </div>
      `;
    }
    return '';
  };

  const updateFormConfig = (formType, newConfig) => {
    setFormConfigs(prev => ({
      ...prev,
      [formType]: newConfig
    }));
  };

  const applyJsonChanges = () => {
    try {
      const parsed = JSON.parse(jsonEditor);
      setFormConfigs(parsed);
      setCurrentView('preview');
    } catch (error) {
      alert('Invalid JSON format');
    }
  };

  const renderFormA = (config, editable = false) => {
    const { fields } = config;
    
    const renderValidationRow = (limitType) => {
      const data = fields.validationCriteria[limitType];
      return (
        <tr>
          <td className="border border-gray-300 px-4 py-2 font-bold align-top">{limitType.charAt(0).toUpperCase() + limitType.slice(1)}</td>
          <td className="border border-gray-300 px-4 py-2"></td>
          <td className="border border-gray-300 px-4 py-2 align-top">
            {editable ? (
              <div className="space-y-2">
                {data.map((item, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={item.discrete}
                    onChange={(e) => {
                      const newLimitData = [...data];
                      newLimitData[idx] = { ...newLimitData[idx], discrete: e.target.value };
                      updateFormConfig('A', { ...config, fields: { ...fields, validationCriteria: { ...fields.validationCriteria, [limitType]: newLimitData } } });
                    }}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                ))}
              </div>
            ) : (
              data.map((item, idx) => <div key={idx}>{item.discrete}</div>)
            )}
          </td>
          <td className="border border-gray-300 px-4 py-2 align-top">
            {editable ? (
              <div className="space-y-2">
                {data.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={item.meaning}
                      onChange={(e) => {
                        const newLimitData = [...data];
                        newLimitData[idx] = { ...newLimitData[idx], meaning: e.target.value };
                        updateFormConfig('A', { ...config, fields: { ...fields, validationCriteria: { ...fields.validationCriteria, [limitType]: newLimitData } } });
                      }}
                      className="w-full px-2 py-1 border border-gray-300 rounded"
                    />
                    <button onClick={() => {
                      const newLimitData = data.filter((_, i) => i !== idx);
                      updateFormConfig('A', { ...config, fields: { ...fields, validationCriteria: { ...fields.validationCriteria, [limitType]: newLimitData } } });
                    }} className="text-red-500 hover:text-red-700 flex-shrink-0">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button onClick={() => {
                  const newLimitData = [...data, { discrete: '', meaning: '' }];
                  updateFormConfig('A', { ...config, fields: { ...fields, validationCriteria: { ...fields.validationCriteria, [limitType]: newLimitData } } });
                }} className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1">
                  <Plus size={14} /><span>Add Criterion</span>
                </button>
              </div>
            ) : (
              data.map((item, idx) => <div key={idx}>{item.meaning}</div>)
            )}
          </td>
        </tr>
      );
    };

    return (
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-2">
          <div className="flex items-center">
            <span className="font-bold w-40">Name</span>
            {editable ? (
              <input
                type="text"
                value={fields.name}
                onChange={(e) => updateFormConfig('A', { ...config, fields: { ...fields, name: e.target.value } })}
                className="flex-1 px-2 py-1 border border-gray-300 rounded"
              />
            ) : (
              <span>{fields.name}</span>
            )}
          </div>
          {fields.alias.map((alias, idx) => (
            <div key={idx} className="flex items-center">
              <span className="font-bold w-40">Alias</span>
              {editable ? (
                <input
                  type="text"
                  value={alias}
                  onChange={(e) => {
                    const newAliases = [...fields.alias];
                    newAliases[idx] = e.target.value;
                    updateFormConfig('A', { ...config, fields: { ...fields, alias: newAliases } });
                  }}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>{alias}</span>
              )}
            </div>
          ))}
          <div className="flex">
            <span className="font-bold w-40 pt-1">Description</span>
            {editable ? (
              <textarea
                value={fields.description}
                onChange={(e) => updateFormConfig('A', { ...config, fields: { ...fields, description: e.target.value } })}
                className="flex-1 px-2 py-1 border border-gray-300 rounded h-20"
              />
            ) : (
              <span className="flex-1">{fields.description}</span>
            )}
          </div>
        </div>

        {/* Element Characteristics */}
        <div>
          <hr className="my-8 border-t-2 border-blue-100" />
          <h3 className="text-xl font-bold text-blue-600 mb-4">Element Characteristics</h3>
          <div className="space-y-2">
            {Object.entries(fields.elementCharacteristics).map(([key, value]) => (
              <div key={key} className="flex items-center">
                <span className="font-bold w-40 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                {editable ? (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => updateFormConfig('A', { ...config, fields: { ...fields, elementCharacteristics: { ...fields.elementCharacteristics, [key]: e.target.value } } })}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded"
                  />
                ) : (
                  <span>{value}</span>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex">
             <span className="font-bold w-40 pt-1"></span>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 flex-1">
              {Object.entries(fields.dataTypes).map(([type, checked]) => (
                <div key={type} className="flex items-center">
                  {editable ? (
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => updateFormConfig('A', { ...config, fields: { ...fields, dataTypes: { ...fields.dataTypes, [type]: e.target.checked } } })}
                      className="mr-2 h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                  ) : (
                    <div className={`w-4 h-4 border-2 mr-2 flex items-center justify-center rounded-sm ${ checked ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-400' }`}>
                      {checked && <span className="text-white text-xs font-bold">✓</span>}
                    </div>
                  )}
                  <label className="text-sm capitalize">{type}</label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Validation Criteria */}
        <div>
          <hr className="my-8 border-t-2 border-blue-100" />
          <h3 className="text-xl font-bold text-blue-600 mb-4">Validation Criteria</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-600 w-1/6">Limit</th>
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-600 w-1/6">Continuous</th>
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-600">Discrete</th>
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-600">Meaning</th>
              </tr>
            </thead>
            <tbody>
              {renderValidationRow('upper')}
              {renderValidationRow('lower')}
            </tbody>
          </table>
        </div>

        {/* Comments */}
        <div>
          <div className="flex">
            <span className="font-bold w-40 pt-1">Comments</span>
            {editable ? (
              <textarea
                value={fields.comments}
                onChange={(e) => updateFormConfig('A', { ...config, fields: { ...fields, comments: e.target.value } })}
                className="w-full flex-1 px-2 py-1 border border-gray-300 rounded h-16"
              />
            ) : (
              <p className="flex-1">{fields.comments}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderFormB = (config, editable = false) => {
    // ... (unchanged)
    const { fields } = config;
    
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          {['id', 'name', 'description', 'source', 'destination', 'dataStructure', 'volumeTime'].map(field => (
            <div key={field} className="flex">
              <span className="font-bold w-40 capitalize">{field.replace(/([A-Z])/g, ' $1')}</span>
              {editable ? (
                field === 'description' ? (
                  <textarea
                    value={fields[field]}
                    onChange={(e) => updateFormConfig('B', { ...config, fields: { ...fields, [field]: e.target.value } })}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded h-20"
                  />
                ) : (
                  <input
                    type="text"
                    value={fields[field]}
                    onChange={(e) => updateFormConfig('B', { ...config, fields: { ...fields, [field]: e.target.value } })}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded"
                  />
                )
              ) : (
                <span className="flex-1">{fields[field]}</span>
              )}
            </div>
          ))}
        </div>

        <div className="flex">
          <span className="font-bold w-40">Type of data flow</span>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 flex-1">
            {Object.entries(fields.dataFlowTypes).map(([type, checked]) => (
              <div key={type} className="flex items-center">
                {editable ? (
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => updateFormConfig('B', { ...config, fields: { ...fields, dataFlowTypes: { ...fields.dataFlowTypes, [type]: e.target.checked } } })}
                    className="mr-2 h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                ) : (
                  <div className={`w-4 h-4 border-2 mr-2 flex items-center justify-center rounded-sm ${ checked ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-400' }`}>
                    {checked && <span className="text-white text-xs font-bold">✓</span>}
                  </div>
                )}
                <label className="text-sm capitalize">{type}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex">
          <span className="font-bold w-40">Comments</span>
          {editable ? (
            <textarea
              value={fields.comments}
              onChange={(e) => updateFormConfig('B', { ...config, fields: { ...fields, comments: e.target.value } })}
              className="w-full flex-1 px-2 py-1 border border-gray-300 rounded h-20"
            />
          ) : (
            <p className="flex-1">{fields.comments}</p>
          )}
        </div>
      </div>
    );
  };

  const renderFormC = (config, editable = false) => {
    // ... (unchanged)
    const { fields } = config;
    
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          {['id', 'name', 'alias', 'description'].map(field => (
            <div key={field} className="flex">
              <span className="font-bold w-40 capitalize">{field}</span>
              {editable ? (
                field === 'description' ? (
                  <textarea
                    value={Array.isArray(fields[field]) ? fields[field].join(', ') : fields[field]}
                    onChange={(e) => updateFormConfig('C', { ...config, fields: { ...fields, [field]: field === 'alias' ? e.target.value.split(',').map(s => s.trim()) : e.target.value } })}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded h-20"
                  />
                ) : (
                  <input
                    type="text"
                    value={Array.isArray(fields[field]) ? fields[field].join(', ') : fields[field]}
                    onChange={(e) => updateFormConfig('C', { ...config, fields: { ...fields, [field]: field === 'alias' ? e.target.value.split(',').map(s => s.trim()) : e.target.value } })}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded"
                  />
                )
              ) : (
                <span className="flex-1">
                  {Array.isArray(fields[field]) ? fields[field].join(', ') : fields[field]}
                </span>
              )}
            </div>
          ))}
        </div>

        <div>
          <h3 className="text-xl font-bold text-blue-600 mb-4">Data Store Characteristics</h3>
          <div className="space-y-2">
            {Object.entries(fields.dataStoreCharacteristics).map(([key, value]) => (
              <div key={key} className="flex items-center">
                <span className="font-bold w-40 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                {editable ? (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => updateFormConfig('C', { ...config, fields: { ...fields, dataStoreCharacteristics: { ...fields.dataStoreCharacteristics, [key]: e.target.value } } })}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded"
                  />
                ) : (
                  <span>{value}</span>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex">
            <span className="font-bold w-40">Access Types</span>
            <div className="flex flex-wrap gap-x-8 gap-y-2 flex-1">
              {Object.entries(fields.accessTypes).map(([type, checked]) => (
                <div key={type} className="flex items-center">
                  {editable ? (
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => updateFormConfig('C', { ...config, fields: { ...fields, accessTypes: { ...fields.accessTypes, [type]: e.target.checked } } })}
                      className="mr-2 h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                  ) : (
                    <div className={`w-4 h-4 border-2 mr-2 flex items-center justify-center rounded-sm ${ checked ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-400' }`}>
                      {checked && <span className="text-white text-xs font-bold">✓</span>}
                    </div>
                  )}
                  <label className="text-sm capitalize">{type}</label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {['dataSetName', 'copyMember', 'structure', 'primaryKey'].map(field => (
            <div key={field} className="flex items-center">
              <span className="font-bold w-40 capitalize">{field.replace(/([A-Z])/g, ' $1')}</span>
              {editable ? (
                <input
                  type="text"
                  value={fields[field]}
                  onChange={(e) => updateFormConfig('C', { ...config, fields: { ...fields, [field]: e.target.value } })}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>{fields[field]}</span>
              )}
            </div>
          ))}
          
          <div className="flex">
            <span className="font-bold w-40 pt-1">Secondary Keys</span>
            {editable ? (
              <input
                type="text"
                value={fields.secondaryKeys.join(', ')}
                onChange={(e) => updateFormConfig('C', { ...config, fields: { ...fields, secondaryKeys: e.target.value.split(',').map(s => s.trim()) } })}
                className="flex-1 px-2 py-1 border border-gray-300 rounded"
                placeholder="key one, key two, ..."
              />
            ) : (
              <div>
                {fields.secondaryKeys.map((key, idx) => (
                  <div key={idx}>{idx + 1}. {key}</div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex">
          <span className="font-bold w-40 pt-1">Comments</span>
          {editable ? (
            <textarea
              value={fields.comments}
              onChange={(e) => updateFormConfig('C', { ...config, fields: { ...fields, comments: e.target.value } })}
              className="w-full flex-1 px-2 py-1 border border-gray-300 rounded h-20"
            />
          ) : (
            <p className="flex-1">{fields.comments}</p>
          )}
        </div>
      </div>
    );
  };

  const renderCurrentForm = (editable = false) => {
    const config = formConfigs[selectedForm];
    switch (selectedForm) {
      case 'A':
        return renderFormA(config, editable);
      case 'B':
        return renderFormB(config, editable);
      case 'C':
        return renderFormC(config, editable);
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-800">SAD Form Builder</h1>
            
            <div className="flex items-center space-x-2">
              <select
                value={selectedForm}
                onChange={(e) => setSelectedForm(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="A">A1 - Element Description</option>
                <option value="B">B1 - Data Flow Description</option>
                <option value="C">C1 - Data Store Description</option>
              </select>
              
              <div className="h-6 border-l border-gray-300 mx-2"></div>

              <button
                onClick={() => setCurrentView('preview')}
                className={`px-3 py-2 rounded-md flex items-center space-x-2 text-sm font-medium ${ currentView === 'preview' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300' }`}
              >
                <Eye size={16} />
                <span>Preview</span>
              </button>
              
              <button
                onClick={() => setCurrentView('edit')}
                className={`px-3 py-2 rounded-md flex items-center space-x-2 text-sm font-medium ${ currentView === 'edit' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300' }`}
              >
                <Edit3 size={16} />
                <span>Edit</span>
              </button>
              
              <button
                onClick={() => setCurrentView('code')}
                className={`px-3 py-2 rounded-md flex items-center space-x-2 text-sm font-medium ${ currentView === 'code' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300' }`}
              >
                <Code size={16} />
                <span>JSON</span>
              </button>
              
              <button
                onClick={exportToPNG}
                className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2 text-sm font-medium"
              >
                <Download size={16} />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {(currentView === 'preview' || currentView === 'edit') && (
          <div className="max-w-4xl mx-auto">
             <div className="mb-4 flex items-center">
                <span className="font-semibold text-gray-700 mr-3">Form ID:</span>
                <span className="px-3 py-1 border-2 border-blue-500 rounded text-blue-600 font-bold bg-white">
                    {formConfigs[selectedForm].formId}
                </span>
            </div>

            <div className="bg-white border-2 border-blue-500 rounded-lg p-8 shadow-md" ref={formRef}>
              <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">
                {formConfigs[selectedForm].title}
              </h1>
              
              {renderCurrentForm(currentView === 'edit')}
            </div>
          </div>
        )}

        {currentView === 'code' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">JSON Configuration</h2>
                <button
                  onClick={applyJsonChanges}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2"
                >
                  <Save size={16} />
                  <span>Apply Changes</span>
                </button>
              </div>
              <textarea
                value={jsonEditor}
                onChange={(e) => setJsonEditor(e.target.value)}
                className="w-full h-[60vh] px-4 py-3 border border-gray-300 rounded-md font-mono text-sm bg-gray-50"
                placeholder="Edit JSON configuration..."
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DynamicSADFormBuilder;