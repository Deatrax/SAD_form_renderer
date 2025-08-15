import React, { useState, useRef } from 'react';
import { Download, Plus, Trash2, Edit3, Eye, Code, Save, FileText } from 'lucide-react';

const DynamicSADFormBuilder = () => {
  const [currentView, setCurrentView] = useState('preview');
  const [selectedForm, setSelectedForm] = useState('A');
  const [isEditing, setIsEditing] = useState(false);
  
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
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>SAD Form - ${formConfigs[selectedForm].title}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 20px; 
                background: white;
                color: black;
              }
              .form-container {
                max-width: 800px;
                border: 2px solid #3b82f6;
                border-radius: 8px;
                padding: 20px;
                background: white;
              }
              .form-title {
                color: #3b82f6;
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 20px;
              }
              .section-title {
                color: #3b82f6;
                font-size: 18px;
                font-weight: bold;
                margin: 20px 0 10px 0;
              }
              .field-row {
                display: flex;
                margin-bottom: 8px;
              }
              .field-label {
                font-weight: bold;
                min-width: 150px;
                margin-right: 20px;
              }
              .checkbox-group {
                display: flex;
                flex-wrap: wrap;
                gap: 15px;
                margin-left: 20px;
              }
              .validation-table {
                width: 100%;
                border-collapse: collapse;
                margin: 10px 0;
              }
              .validation-table th, .validation-table td {
                border: 1px solid #ccc;
                padding: 8px;
                text-align: left;
              }
              .validation-table th {
                background: #f5f5f5;
                font-weight: bold;
              }
              .dropdown-container {
                position: absolute;
                top: 20px;
                left: 20px;
              }
              .dropdown {
                padding: 8px 12px;
                border: 2px solid #3b82f6;
                border-radius: 4px;
                background: white;
                color: #3b82f6;
                font-weight: bold;
              }
              @media print {
                .no-print { display: none !important; }
                body { margin: 0; }
              }
            </style>
          </head>
          <body>
            ${formRef.current.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      
      // Wait a moment for content to load, then print
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
      
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try using your browser\'s print function.');
    }
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
    
    return (
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-2">
          <div className="flex">
            <span className="font-bold w-32">Name</span>
            {editable ? (
              <input
                type="text"
                value={fields.name}
                onChange={(e) => updateFormConfig('A', {
                  ...config,
                  fields: { ...fields, name: e.target.value }
                })}
                className="flex-1 px-2 py-1 border border-gray-300 rounded"
              />
            ) : (
              <span>{fields.name}</span>
            )}
          </div>
          {fields.alias.map((alias, idx) => (
            <div key={idx} className="flex">
              <span className="font-bold w-32">Alias</span>
              {editable ? (
                <input
                  type="text"
                  value={alias}
                  onChange={(e) => {
                    const newAliases = [...fields.alias];
                    newAliases[idx] = e.target.value;
                    updateFormConfig('A', {
                      ...config,
                      fields: { ...fields, alias: newAliases }
                    });
                  }}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>{alias}</span>
              )}
            </div>
          ))}
          <div className="flex">
            <span className="font-bold w-32">Description</span>
            {editable ? (
              <textarea
                value={fields.description}
                onChange={(e) => updateFormConfig('A', {
                  ...config,
                  fields: { ...fields, description: e.target.value }
                })}
                className="flex-1 px-2 py-1 border border-gray-300 rounded h-20"
              />
            ) : (
              <span className="flex-1">{fields.description}</span>
            )}
          </div>
        </div>

        {/* Element Characteristics */}
        <div>
          <h3 className="text-lg font-semibold text-blue-600 mb-4">Element Characteristics</h3>
          <div className="space-y-2">
            {Object.entries(fields.elementCharacteristics).map(([key, value]) => (
              <div key={key} className="flex">
                <span className="font-bold w-32 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                {editable ? (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => updateFormConfig('A', {
                      ...config,
                      fields: {
                        ...fields,
                        elementCharacteristics: {
                          ...fields.elementCharacteristics,
                          [key]: e.target.value
                        }
                      }
                    })}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded"
                  />
                ) : (
                  <span>{value}</span>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <span className="font-bold">Default Value:</span>
            <div className="ml-4 mt-2 space-y-1">
              {Object.entries(fields.dataTypes).map(([type, checked]) => (
                <div key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => updateFormConfig('A', {
                      ...config,
                      fields: {
                        ...fields,
                        dataTypes: {
                          ...fields.dataTypes,
                          [type]: e.target.checked
                        }
                      }
                    })}
                    disabled={!editable}
                    className="mr-2"
                  />
                  <label className="text-sm">{type}</label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Validation Criteria */}
        <div>
          <h3 className="text-lg font-semibold text-blue-600 mb-4">Validation Criteria</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Limit</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Continuous</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Discrete</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Meaning</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-bold">Upper</td>
                <td className="border border-gray-300 px-4 py-2"></td>
                <td className="border border-gray-300 px-4 py-2">
                  {fields.validationCriteria.upper.map(item => item.discrete).join(', ')}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {fields.validationCriteria.upper.map(item => item.meaning).join(', ')}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-bold">Lower</td>
                <td className="border border-gray-300 px-4 py-2"></td>
                <td className="border border-gray-300 px-4 py-2"></td>
                <td className="border border-gray-300 px-4 py-2"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Comments */}
        <div>
          <span className="font-bold">Comments:</span>
          {editable ? (
            <textarea
              value={fields.comments}
              onChange={(e) => updateFormConfig('A', {
                ...config,
                fields: { ...fields, comments: e.target.value }
              })}
              className="w-full mt-2 px-2 py-1 border border-gray-300 rounded h-16"
            />
          ) : (
            <p className="mt-2">{fields.comments}</p>
          )}
        </div>
      </div>
    );
  };

  const renderFormB = (config, editable = false) => {
    const { fields } = config;
    
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          {['id', 'name', 'description', 'source', 'destination', 'dataStructure', 'volumeTime'].map(field => (
            <div key={field} className="flex">
              <span className="font-bold w-40 capitalize">{field.replace(/([A-Z])/g, ' $1')}:</span>
              {editable ? (
                field === 'description' ? (
                  <textarea
                    value={fields[field]}
                    onChange={(e) => updateFormConfig('B', {
                      ...config,
                      fields: { ...fields, [field]: e.target.value }
                    })}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded h-20"
                  />
                ) : (
                  <input
                    type="text"
                    value={fields[field]}
                    onChange={(e) => updateFormConfig('B', {
                      ...config,
                      fields: { ...fields, [field]: e.target.value }
                    })}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded"
                  />
                )
              ) : (
                <span className="flex-1">{fields[field]}</span>
              )}
            </div>
          ))}
        </div>

        <div>
          <span className="font-bold">Type of data flow:</span>
          <div className="ml-4 mt-2 space-y-1">
            {Object.entries(fields.dataFlowTypes).map(([type, checked]) => (
              <div key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => updateFormConfig('B', {
                    ...config,
                    fields: {
                      ...fields,
                      dataFlowTypes: {
                        ...fields.dataFlowTypes,
                        [type]: e.target.checked
                      }
                    }
                  })}
                  disabled={!editable}
                  className="mr-2"
                />
                <label className="text-sm capitalize">{type}</label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <span className="font-bold">Comments:</span>
          {editable ? (
            <textarea
              value={fields.comments}
              onChange={(e) => updateFormConfig('B', {
                ...config,
                fields: { ...fields, comments: e.target.value }
              })}
              className="w-full mt-2 px-2 py-1 border border-gray-300 rounded h-20"
            />
          ) : (
            <p className="mt-2">{fields.comments}</p>
          )}
        </div>
      </div>
    );
  };

  const renderFormC = (config, editable = false) => {
    const { fields } = config;
    
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          {['id', 'name', 'alias', 'description'].map(field => (
            <div key={field} className="flex">
              <span className="font-bold w-32 capitalize">{field}:</span>
              {editable ? (
                field === 'description' ? (
                  <textarea
                    value={Array.isArray(fields[field]) ? fields[field].join(', ') : fields[field]}
                    onChange={(e) => updateFormConfig('C', {
                      ...config,
                      fields: { 
                        ...fields, 
                        [field]: field === 'alias' ? e.target.value.split(', ') : e.target.value
                      }
                    })}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded h-20"
                  />
                ) : (
                  <input
                    type="text"
                    value={Array.isArray(fields[field]) ? fields[field].join(', ') : fields[field]}
                    onChange={(e) => updateFormConfig('C', {
                      ...config,
                      fields: { 
                        ...fields, 
                        [field]: field === 'alias' ? e.target.value.split(', ') : e.target.value
                      }
                    })}
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
          <h3 className="text-lg font-semibold text-blue-600 mb-4">Data Store Characteristics</h3>
          <div className="space-y-2">
            {Object.entries(fields.dataStoreCharacteristics).map(([key, value]) => (
              <div key={key} className="flex">
                <span className="font-bold w-40 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                {editable ? (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => updateFormConfig('C', {
                      ...config,
                      fields: {
                        ...fields,
                        dataStoreCharacteristics: {
                          ...fields.dataStoreCharacteristics,
                          [key]: e.target.value
                        }
                      }
                    })}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded"
                  />
                ) : (
                  <span>{value}</span>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex flex-wrap gap-4">
            {Object.entries(fields.accessTypes).map(([type, checked]) => (
              <div key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => updateFormConfig('C', {
                    ...config,
                    fields: {
                      ...fields,
                      accessTypes: {
                        ...fields.accessTypes,
                        [type]: e.target.checked
                      }
                    }
                  })}
                  disabled={!editable}
                  className="mr-2"
                />
                <label className="text-sm capitalize">{type}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {['dataSetName', 'copyMember', 'structure', 'primaryKey'].map(field => (
            <div key={field} className="flex">
              <span className="font-bold w-32 capitalize">{field.replace(/([A-Z])/g, ' $1')}:</span>
              {editable ? (
                <input
                  type="text"
                  value={fields[field]}
                  onChange={(e) => updateFormConfig('C', {
                    ...config,
                    fields: { ...fields, [field]: e.target.value }
                  })}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>{fields[field]}</span>
              )}
            </div>
          ))}
          
          <div className="flex">
            <span className="font-bold w-32">Secondary Keys:</span>
            {editable ? (
              <input
                type="text"
                value={fields.secondaryKeys.join(', ')}
                onChange={(e) => updateFormConfig('C', {
                  ...config,
                  fields: { ...fields, secondaryKeys: e.target.value.split(', ') }
                })}
                className="flex-1 px-2 py-1 border border-gray-300 rounded"
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

        <div>
          <span className="font-bold">Comments:</span>
          {editable ? (
            <textarea
              value={fields.comments}
              onChange={(e) => updateFormConfig('C', {
                ...config,
                fields: { ...fields, comments: e.target.value }
              })}
              className="w-full mt-2 px-2 py-1 border border-gray-300 rounded h-20"
            />
          ) : (
            <p className="mt-2">{fields.comments}</p>
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
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">SAD Form Builder</h1>
            
            <div className="flex space-x-2">
              <select
                value={selectedForm}
                onChange={(e) => setSelectedForm(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="A">A1 - Element Description</option>
                <option value="B">B1 - Data Flow Description</option>
                <option value="C">C1 - Data Store Description</option>
              </select>
              
              <button
                onClick={() => setCurrentView('preview')}
                className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
                  currentView === 'preview' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                <Eye size={16} />
                <span>Preview</span>
              </button>
              
              <button
                onClick={() => {setCurrentView('edit'); setIsEditing(true)}}
                className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
                  currentView === 'edit' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                <Edit3 size={16} />
                <span>Edit</span>
              </button>
              
              <button
                onClick={() => setCurrentView('code')}
                className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
                  currentView === 'code' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                <Code size={16} />
                <span>JSON</span>
              </button>
              
              <button
                onClick={exportToPNG}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2"
              >
                <Download size={16} />
                <span>Export PNG</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {(currentView === 'preview' || currentView === 'edit') && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border-2 border-blue-500 rounded-lg p-8" ref={formRef}>
              {/* Form Type Selector (mimicking original dropdown) */}
              <div className="absolute top-2 left-2 no-print">
                <select 
                  value={selectedForm + '1'}
                  onChange={(e) => setSelectedForm(e.target.value.charAt(0))}
                  className="px-3 py-1 border-2 border-blue-500 rounded text-blue-600 font-bold bg-white"
                >
                  <option value="A1">A1</option>
                  <option value="B1">B1</option>
                  <option value="C1">C1</option>
                </select>
              </div>
              
              <h1 className="text-2xl font-bold text-blue-600 mb-6 mt-8">
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
                className="w-full h-96 px-4 py-3 border border-gray-300 rounded-md font-mono text-sm"
                placeholder="Edit JSON configuration..."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicSADFormBuilder;