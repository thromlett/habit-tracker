//DELETE LATER
import BottomBar from "../../components/BottomBar";

export default function ProfilePage() {
  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      <main className="max-w-md mx-auto pt-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        <div className="bg-white rounded-xl shadow p-6 space-y-2">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center text-2xl font-bold text-blue-700">
              U
            </div>
            <div>
              <div className="font-semibold text-lg">User Name</div>
              <div className="text-gray-500 text-sm">user@email.com</div>
            </div>
          </div>
          <hr className="my-4" />
          <div>
            <span className="block text-gray-700 font-medium mb-1">Streak</span>
            <span className="text-blue-700 font-bold text-xl">4 days</span>
          </div>
          {/* Add more settings/info here */}
        </div>
      </main>
      <BottomBar />
    </div>
  );
}
