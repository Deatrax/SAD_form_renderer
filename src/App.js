import React, { useState, useRef } from 'react';
import { Download, Plus, Trash2, Edit3, Eye, Code, Save } from 'lucide-react';
import html2canvas from 'html2canvas';

const DynamicSADFormBuilder = () => {
  const [currentView, setCurrentView] = useState('preview');
  const [selectedForm, setSelectedForm] = useState('A');
  
  const [formConfigs, setFormConfigs] = useState({
    A: {
      formId: 'A1',
      title: 'Element Description Form',
      fields: {
        name: 'Member ID',
        alias: ['Student ID', 'IUT ID Number'],
        description: 'Unique identifier for each registered IUTCS member, matching their official IUT-issued Student ID; links all system records to the correct member profile.',
        elementCharacteristics: { length: '9', inputFormat: '999999999', outputFormat: '999999999', defaultValue: '' },
        dataTypes: { alphabetic: false, alphanumeric: false, date: false, numeric: true, continuous: false, discrete: true, base: true, derived: false },
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
        id: 'DF-01', name: 'Task Assignment Request', description: 'Contains details of tasks assigned by the Team Lead, including task title, description, assignee(s), deadlines, and priority level, which will be stored and tracked in the Task Database.', source: 'Team Lead', destination: 'Assign Tasks (Process 1 in Diagram 0)', dataStructure: 'Task Details', volumeTime: '5-8 assignments per event cycle',
        dataFlowTypes: { discrete: false, screen: true, report: false, form: false, internal: false },
        comments: 'Task assignment requests are submitted through the system\'s executive dashboard interface. Upon submission, the data is validated, assigned a unique task_id, and stored in the Task Database. The process also triggers downstream flows for notifications and task monitoring.'
      }
    },
    C: {
      formId: 'C1',
      title: 'Data Store Description Form',
      fields: {
        id: 'D1', name: 'Task Database', alias: ['Task DB', 'Assignment Records'], description: 'Contains a record for each task assigned within IUTCS. Stores task header details (task_id, title, description, creator, create date, due date/time, priority, status) and links to assigned members and notifications. Used by Processes 1 (Assign Tasks), 2 (View & Complete Task), and 4 (Notify) in DFD-0.',
        dataStoreCharacteristics: { fileType: 'Computer', fileFormat: 'Database', recordSize: '720', numberOfRecords: '10000 (Maximum)', average: '2000', percentageAnnualGrowth: '15%', blockSize: '4096' },
        accessTypes: { manual: false, indexed: true, sequential: false, direct: true },
        dataSetName: 'Task.MST', copyMember: 'TaskMaster', structure: 'Task Assignment Request', primaryKey: 'Task ID', secondaryKeys: ['Member Id', 'Due date', 'Status', 'Priority Level'],
        comments: 'Active records retained for 3 academic years, then archived to history storage. Weekly incremental and monthly full backups recommended. Edit access limited to Executive/Team Leads and System Admin; members have read/update status on tasks assigned to them. Indices on (member_id) and (due_date, status) support reminders and dashboards.'
      }
    }
  });

  const [jsonEditor, setJsonEditor] = useState('');
  const formRef = useRef(null);

  React.useEffect(() => {
    if (currentView === 'code') {
      setJsonEditor(JSON.stringify(formConfigs, null, 2));
    }
  }, [currentView, formConfigs]);

  const downloadPng = () => {
    if (!formRef.current) {
      alert("Form element not found.");
      return;
    }
    
    const formElement = formRef.current;
    const currentConfig = formConfigs[selectedForm];
    const filename = `SAD-Form-${currentConfig.formId}.png`;

    html2canvas(formElement, {
      scale: 2, // Capture at 2x resolution for better quality
      useCORS: true,
      backgroundColor: '#ffffff', // Explicitly set background to white
      onclone: (document) => {
        // Ensure borders are rendered correctly during capture
        document.getElementById('form-container').style.boxShadow = 'none';
      }
    }).then(canvas => {
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }).catch(error => {
      console.error('Error exporting to PNG:', error);
      alert('Could not export the form as PNG. Please check the console for details.');
    });
  };

  const updateFormConfig = (formType, newConfig) => {
    setFormConfigs(prev => ({ ...prev, [formType]: newConfig }));
  };

  const applyJsonChanges = () => {
    try {
      const parsed = JSON.parse(jsonEditor);
      setFormConfigs(parsed);
      setCurrentView('preview');
    } catch (error) { alert('Invalid JSON format'); }
  };

  // The renderForm functions are unchanged.
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
                    key={idx} type="text" value={item.discrete}
                    onChange={(e) => {
                      const newLimitData = [...data];
                      newLimitData[idx] = { ...newLimitData[idx], discrete: e.target.value };
                      updateFormConfig('A', { ...config, fields: { ...fields, validationCriteria: { ...fields.validationCriteria, [limitType]: newLimitData } } });
                    }}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  />
                ))}
              </div>
            ) : ( data.map((item, idx) => <div key={idx}>{item.discrete}</div>) )}
          </td>
          <td className="border border-gray-300 px-4 py-2 align-top">
            {editable ? (
              <div className="space-y-2">
                {data.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="text" value={item.meaning}
                      onChange={(e) => {
                        const newLimitData = [...data];
                        newLimitData[idx] = { ...newLimitData[idx], meaning: e.target.value };
                        updateFormConfig('A', { ...config, fields: { ...fields, validationCriteria: { ...fields.validationCriteria, [limitType]: newLimitData } } });
                      }}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
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
            ) : ( data.map((item, idx) => <div key={idx}>{item.meaning}</div>) )}
          </td>
        </tr>
      );
    };

    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center">
            <span className="font-bold w-40">Name</span>
            {editable ? <input type="text" value={fields.name} onChange={(e) => updateFormConfig('A', { ...config, fields: { ...fields, name: e.target.value } })} className="flex-1 px-2 py-1 border border-gray-300 rounded" /> : <span>{fields.name}</span>}
          </div>
          {fields.alias.map((alias, idx) => (
            <div key={idx} className="flex items-center">
              <span className="font-bold w-40">Alias</span>
              {editable ? <input type="text" value={alias} onChange={(e) => { const newAliases = [...fields.alias]; newAliases[idx] = e.target.value; updateFormConfig('A', { ...config, fields: { ...fields, alias: newAliases } }); }} className="flex-1 px-2 py-1 border border-gray-300 rounded" /> : <span>{alias}</span>}
            </div>
          ))}
          <div className="flex">
            <span className="font-bold w-40 pt-1">Description</span>
            {editable ? <textarea value={fields.description} onChange={(e) => updateFormConfig('A', { ...config, fields: { ...fields, description: e.target.value } })} className="flex-1 px-2 py-1 border border-gray-300 rounded h-20" /> : <span className="flex-1">{fields.description}</span>}
          </div>
        </div>

        <div>
          <hr className="my-8 border-t-2 border-blue-50" />
          <h3 className="text-xl font-bold text-blue-600 mb-4">Element Characteristics</h3>
          <div className="space-y-2">
            {Object.entries(fields.elementCharacteristics).map(([key, value]) => (
              <div key={key} className="flex items-center">
                <span className="font-bold w-40 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                {editable ? <input type="text" value={value} onChange={(e) => updateFormConfig('A', { ...config, fields: { ...fields, elementCharacteristics: { ...fields.elementCharacteristics, [key]: e.target.value } } })} className="flex-1 px-2 py-1 border border-gray-300 rounded" /> : <span>{value}</span>}
              </div>
            ))}
          </div>
          <div className="mt-4 flex">
            <span className="font-bold w-40 pt-1"></span>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 flex-1">
              {Object.entries(fields.dataTypes).map(([type, checked]) => (
                <div key={type} className="flex items-center">
                  {editable ? <input type="checkbox" checked={checked} onChange={(e) => updateFormConfig('A', { ...config, fields: { ...fields, dataTypes: { ...fields.dataTypes, [type]: e.target.checked } } })} className="mr-2 h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300" /> : <div className={`w-4 h-4 border-2 mr-2 flex items-center justify-center rounded-sm ${ checked ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-400' }`}>{checked && <span className="text-white text-xs font-bold">✓</span>}</div>}
                  <label className="text-sm capitalize">{type}</label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <hr className="my-8 border-t-2 border-blue-50" />
          <h3 className="text-xl font-bold text-blue-600 mb-4">Validation Criteria</h3>
          <table className="w-full border-collapse border border-gray-300 text-sm">
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

        <div>
          <div className="flex">
            <span className="font-bold w-40 pt-1">Comments</span>
            {editable ? <textarea value={fields.comments} onChange={(e) => updateFormConfig('A', { ...config, fields: { ...fields, comments: e.target.value } })} className="w-full flex-1 px-2 py-1 border border-gray-300 rounded h-16" /> : <p className="flex-1">{fields.comments}</p>}
          </div>
        </div>
      </div>
    );
  };
  const renderFormB = (config, editable = false) => { return <div>Form B Content</div>; };
  const renderFormC = (config, editable = false) => { return <div>Form C Content</div>; };

  const renderCurrentForm = (editable = false) => {
    const config = formConfigs[selectedForm];
    switch (selectedForm) {
      case 'A': return renderFormA(config, editable);
      case 'B': return renderFormB(config, editable);
      case 'C': return renderFormC(config, editable);
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-800">SAD Form Builder</h1>
            <div className="flex items-center space-x-2">
              <select value={selectedForm} onChange={(e) => setSelectedForm(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="A">A1 - Element Description</option>
                <option value="B">B1 - Data Flow Description</option>
                <option value="C">C1 - Data Store Description</option>
              </select>
              <div className="h-6 border-l border-gray-300 mx-2"></div>
              <button onClick={() => setCurrentView('preview')} className={`px-3 py-2 rounded-md flex items-center space-x-2 text-sm font-medium ${ currentView === 'preview' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300' }`}>
                <Eye size={16} /><span>Preview</span>
              </button>
              <button onClick={() => setCurrentView('edit')} className={`px-3 py-2 rounded-md flex items-center space-x-2 text-sm font-medium ${ currentView === 'edit' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300' }`}>
                <Edit3 size={16} /><span>Edit</span>
              </button>
              <button onClick={() => setCurrentView('code')} className={`px-3 py-2 rounded-md flex items-center space-x-2 text-sm font-medium ${ currentView === 'code' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300' }`}>
                <Code size={16} /><span>JSON</span>
              </button>
              <button onClick={downloadPng} className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2 text-sm font-medium">
                <Download size={16} /><span>Download PNG</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {(currentView === 'preview' || currentView === 'edit') && (
          <div className="max-w-4xl mx-auto">
            <div id="form-container" className="bg-white border-2 border-blue-500 rounded-lg p-8 shadow-md" ref={formRef}>
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
                <button onClick={applyJsonChanges} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2">
                  <Save size={16} /><span>Apply Changes</span>
                </button>
              </div>
              <textarea value={jsonEditor} onChange={(e) => setJsonEditor(e.target.value)} className="w-full h-[60vh] px-4 py-3 border border-gray-300 rounded-md font-mono text-sm bg-gray-50" placeholder="Edit JSON configuration..."/>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DynamicSADFormBuilder;