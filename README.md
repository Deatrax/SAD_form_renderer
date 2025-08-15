## Form Renderer for System Analysis and Design Course

<img width="700" height="685" alt="image" src="https://github.com/user-attachments/assets/4636a131-629f-4391-945d-9f298ba9a484" />

### Usage
- Clone the repository
- run ```npm install``` to install necessary dependencies
- Add your form information in src/data/forms.json file [See **Adding Form Data** section below]
- Start the app with ```npm run start```
- Use the dropdown to select which form to render

### Adding Form Data
There are 3 types of forms:
- Type A: Data Element description form
- Type B: Data flow description form
- Type C: Data Store description form

In order to modify the form, values go to the forms.json file and edit the details. In order to add a new form, you can just copy and paste one of the samples, and make sure to update the formId. However, if you want to add a new field or remove the current ones, or even change the whole form schema, make sure you also update the ```FormTypeA.jsx```, ```FormTypeB.jsx``` or ```FormTypeC.jsx``` files in the ```src/components``` folder.

### Changing the design
I've used tailwindcss to style the forms, you can directly modify them in the ```FormType{}.jsx``` files. Additionally, if you want to style things your own way, you can use the ```formStyles.css``` file. Be sure to uncomment the ```import "./formStyles.css";``` at the top of the corresponding ```FormType{}.jsx``` file. 

