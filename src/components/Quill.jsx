import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import Spinner from "./Spinner";

const QuillNoSSRWrapper = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p className="block w-full h-32 border border-gray-400 rounded-lg"><Spinner /> </p>,
});

export default function Quill({ value, onChange }) {
  return (
    <QuillNoSSRWrapper
      theme="snow"
      className="quill_comp block w-full border border-gray-300"
      value={value}
      onChange={onChange}
    />
  );
}
