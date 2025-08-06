import DirectUploadForm from "./DirectUploadForm";

export default function UploadPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Upload Profile Photo</h1>
      <DirectUploadForm userId="688a6a65be888a80f83af93a" />
      <p className="text-gray-500 mt-2">
        Upload your profile photo directly to Google Cloud Storage.
      </p>
    </div>
  );
}
