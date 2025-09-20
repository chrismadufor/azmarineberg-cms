"use client";

import { useField } from "formik";
import usePasswordToggle from "../hooks/PasswordToggle";
import Select from "react-select";
import makeAnimated from "react-select/animated";
// import Quill from "./Quill";

const animatedComponents = makeAnimated();

export const TextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div className="input-wrap">
      {/* <label className="text-gray-600 text-sm mt-1" htmlFor={props.name}>
        {label}
      </label> */}
      <input
        className="text-input block w-full border border-gray-400 h-12 rounded-md px-3"
        {...field}
        {...props}
        type={props.type}
      />
      {meta.touched && meta.error ? (
        <div className="error text-red-600 text-sm">{meta.error}</div>
      ) : null}
    </div>
  );
};

export const  TextLabelInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div className="input-wrap">
      <label
        className="text-gray-800 font-semibold text-sm mt-1"
        htmlFor={props.name}
      >
        {label}
      </label>
      <input
        className="text-input block w-full border border-gray-400 h-12 rounded-md px-3"
        {...field}
        {...props}
        type={props.type}
      />
      {meta.touched && meta.error ? (
        <div className="error text-red-600 text-sm">{meta.error}</div>
      ) : null}
    </div>
  );
};

export const TextLabelInputNormal = ({ value, onChange, label, name }) => {
  return (
    <div className="input-wrap">
      <label
        className="text-gray-800 font-semibold text-sm mt-1"
        htmlFor={name}
      >
        {label}
      </label>
      <input
        className="text-input block w-full border border-gray-400 h-12 rounded-md px-3"
        name={name}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.name, e.target.value)}
        placeholder={label}
      />
    </div>
  );
};

export const TextAreaLabelNormal = ({ value, onChange, label, name }) => {
  return (
    <div className="input-wrap">
      <label
        className="text-gray-800 font-semibold text-sm mt-1"
        htmlFor={name}
      >
        {label}
      </label>
      <textarea
        className="text-input block w-full border border-gray-400 h-28 pt-3 rounded-md px-3"
        name={name}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.name, e.target.value)}
        placeholder={label}
      ></textarea>
    </div>
  );
};

// export const TextLabelQuill = ({ label, name, value, onChange }) => {
//   // const checkChange = () => {
//   //   console.log("Testing", value)
    
//   // }
//   return (
//     <div className="input-wrap">
//       <label
//         className="text-gray-800 font-semibold text-sm mt-1"
//         htmlFor={name}
//       >
//         {label}
//       </label>
//       <Quill
//         value={value}
//         onChange={onChange}
//       />
//       {/* <Quilljs value={value} onChange={onChange} /> */}
//     </div>
//   );
// };

export const TextAreaInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div className="input-wrap">
      <label
        className="text-gray-800 font-semibold text-sm mt-1"
        htmlFor={props.name}
      >
        {label}
      </label>
      <textarea
        className="text-input block w-full border border-gray-400 h-28 pt-3 rounded-md px-3"
        {...field}
        {...props}
        type={props.type}
      ></textarea>
      {meta.touched && meta.error ? (
        <div className="error text-red-600 text-sm">{meta.error}</div>
      ) : null}
    </div>
  );
};

export const SelectInput = ({ label, data, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div className="input-wrap">
      {label !== "" && (
        <label
          className="text-gray-800 font-semibold text-sm mt-1"
          htmlFor={props.name}
        >
          {label}
        </label>
      )}
      <select
        className="bg-white text-input block w-full border border-gray-400 h-12 rounded-md px-3"
        {...field}
        {...props}
      >
        <option value={""}>Select</option>
        {data.map((item, index) => (
          <option key={index} value={item.value}>
            {item.name}
          </option>
        ))}
      </select>
      {meta.touched && meta.error ? (
        <div className="error text-red-600 text-sm">{meta.error}</div>
      ) : null}
    </div>
  );
};

export const PasswordInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const [passwordInputType, passwordIcon] = usePasswordToggle();
  return (
    <div className="input-wrap">
      <label
        className="text-gray-600 font-semibold text-sm mt-1"
        htmlFor={props.name}
      >
        {label}
      </label>
      <div className="relative w-full flex items-center">
        <input
          className="text-input border border-gray-400 block w-full h-12 rounded-md px-3"
          {...field}
          {...props}
          type={passwordInputType === "password" ? "password" : "text"}
        />

        <div className="absolute right-5 cursor-pointer">{passwordIcon}</div>
      </div>
      {meta.touched && meta.error ? (
        <div className="error text-red-600 text-sm">{meta.error}</div>
      ) : null}
    </div>
  );
};

export const MyCheckbox = ({ children, ...props }) => {
  const [field, meta] = useField({ ...props, type: "checkbox" });
  return (
    <div>
      <label className="checkbox-input my-2 flex items-start">
        <input className="block mt-1 mr-1 border" {...field} {...props} />
        <p className="text-sm text-gray-700">{children}</p>
      </label>
      {meta.touched && meta.error ? (
        <div className="error text-red-600 text-sm">{meta.error}</div>
      ) : null}
    </div>
  );
};

// Formik-integrated MultiSelect Component
export const MultiSelectInput = ({ label, options, ...props }) => {
  const [field, meta, helpers] = useField(props);

  const handleChange = (selectedOptions) => {
    helpers.setValue(selectedOptions || []);
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '48px',
      height: 'auto',
      border: '1px solid #9CA3AF',
      borderRadius: '6px',
      boxShadow: 'none',
      '&:hover': {
        border: '1px solid #9CA3AF',
      },
      '&:focus-within': {
        border: '1px solid #3B82F6',
        boxShadow: '0 0 0 1px #3B82F6',
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '2px 12px',
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#EFF6FF',
      borderRadius: '4px',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#1E40AF',
      fontSize: '14px',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#1E40AF',
      '&:hover': {
        backgroundColor: '#DBEAFE',
        color: '#1E40AF',
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9CA3AF',
    }),
  };

  return (
    <div className="input-wrap">
      {label && (
        <label
          className="text-gray-800 font-semibold text-sm mt-1"
          htmlFor={props.name}
        >
          {label}
        </label>
      )}
      <Select
        {...props}
        value={field.value}
        onChange={handleChange}
        options={options}
        isMulti
        closeMenuOnSelect={false}
        components={animatedComponents}
        styles={customStyles}
        placeholder={`Select ${label?.toLowerCase() || 'options'}...`}
      />
      {meta.touched && meta.error ? (
        <div className="error text-red-600 text-sm">{meta.error}</div>
      ) : null}
    </div>
  );
};

// Non-Formik MultiSelect Component (for backward compatibility)
export default function MultiSelect({ data, label, change, value, disabled }) {
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '48px',
      height: 'auto',
      border: '1px solid #9CA3AF',
      borderRadius: '6px',
      boxShadow: 'none',
      '&:hover': {
        border: '1px solid #9CA3AF',
      },
      '&:focus-within': {
        border: '1px solid #3B82F6',
        boxShadow: '0 0 0 1px #3B82F6',
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '2px 12px',
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#EFF6FF',
      borderRadius: '4px',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#1E40AF',
      fontSize: '14px',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#1E40AF',
      '&:hover': {
        backgroundColor: '#DBEAFE',
        color: '#1E40AF',
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9CA3AF',
    }),
  };

  return (
    <div className="input-wrap">
      <label className="text-gray-800 font-semibold text-sm mt-1">
        {label}
      </label>
      <Select
        onChange={change}
        value={value}
        closeMenuOnSelect={false}
        components={animatedComponents}
        isMulti
        options={data}
        isDisabled={disabled}
        styles={customStyles}
        placeholder={`Select ${label?.toLowerCase() || 'options'}...`}
      />
    </div>
  );
}

// Formik-integrated SingleSelect Component
export const SingleSelectInput = ({ label, options, ...props }) => {
  const [field, meta, helpers] = useField(props);

  const handleChange = (selectedOption) => {
    helpers.setValue(selectedOption || null);
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      height: '48px',
      minHeight: '48px',
      border: '1px solid #9CA3AF',
      borderRadius: '6px',
      boxShadow: 'none',
      '&:hover': {
        border: '1px solid #9CA3AF',
      },
      '&:focus-within': {
        border: '1px solid #3B82F6',
        boxShadow: '0 0 0 1px #3B82F6',
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: '46px',
      padding: '0 12px',
    }),
    input: (provided) => ({
      ...provided,
      margin: '0',
      paddingTop: '0',
      paddingBottom: '0',
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: '46px',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#374151',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9CA3AF',
    }),
  };

  return (
    <div className="input-wrap">
      {label && (
        <label
          className="text-gray-800 font-semibold text-sm mt-1"
          htmlFor={props.name}
        >
          {label}
        </label>
      )}
      <Select
        {...props}
        value={field.value}
        onChange={handleChange}
        options={options}
        closeMenuOnSelect={true}
        components={animatedComponents}
        styles={customStyles}
        placeholder={`Select ${label?.toLowerCase() || 'option'}...`}
      />
      {meta.touched && meta.error ? (
        <div className="error text-red-600 text-sm">{meta.error}</div>
      ) : null}
    </div>
  );
};

// Non-Formik SingleSelect Component (for backward compatibility)
export function SingleSelect({ data, label, change, value, disabled }) {
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      height: '48px',
      minHeight: '48px',
      border: '1px solid #9CA3AF',
      borderRadius: '6px',
      boxShadow: 'none',
      '&:hover': {
        border: '1px solid #9CA3AF',
      },
      '&:focus-within': {
        border: '1px solid #3B82F6',
        boxShadow: '0 0 0 1px #3B82F6',
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: '46px',
      padding: '0 12px',
    }),
    input: (provided) => ({
      ...provided,
      margin: '0',
      paddingTop: '0',
      paddingBottom: '0',
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: '46px',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#374151',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9CA3AF',
    }),
  };

  return (
    <div className="input-wrap">
      <label className="text-gray-800 font-semibold text-sm mt-1">
        {label}
      </label>
      <Select
        onChange={change}
        value={value}
        closeMenuOnSelect={true}
        components={animatedComponents}
        options={data}
        isDisabled={disabled}
        styles={customStyles}
        placeholder={`Select ${label?.toLowerCase() || 'option'}...`}
      />
    </div>
  );
}
