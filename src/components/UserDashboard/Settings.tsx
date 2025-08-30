import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";

const Settings = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
    const [cookies] = useCookies(["access_token"]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      // Make API call to change password
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}customer/change-password`,
        { oldPassword,newPassword},
        { headers: { Authorization: `Bearer ${cookies.access_token}` } } 
      );

      toast.success(response.data.message || "Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to change password. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:ml-80 sm:ml-0 overflow-x-hidden">
      <h3 className="text-2xl mb-6 text-blue-950 font-bold inline-block border-b-2 border-dashed border-black">
        Settings
      </h3>

      {/* Change Password Form */}
      <form
        onSubmit={handlePasswordChange}
        className="bg-white shadow-md p-4 mb-6 rounded-md"
      >
        <h4 className="text-xl font-semibold mb-4 text-blue-700">Change Password</h4>
        <div>
          <label
            htmlFor="current_pwd"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Current Password
          </label>
          <input
            type="password"
            id="current_pwd"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div className="mt-4">
          <label
            htmlFor="new_pwd"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            New Password
          </label>
          <input
            type="password"
            id="new_pwd"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-teal-800 text-white py-2 px-6 rounded-md hover:bg-teal-700"
            disabled={isSubmitting}
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
