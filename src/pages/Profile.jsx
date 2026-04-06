import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Mail, Hash, Phone, User, Upload, Save, ImageUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  fetchMyProfile,
  updateMyProfile,
  uploadMyProfileImage,
} from "@/redux/slices/userSlice";
import { syncAuthUser } from "@/redux/slices/authSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const {
    profile,
    profileLoading,
    profileActionLoading,
    profileUploading,
    profileError,
  } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    room_no: "",
    contactNumber: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    dispatch(fetchMyProfile());
  }, [dispatch]);

  useEffect(() => {
    if (!profile) {
      return;
    }

    const fullName = [profile.firstName, profile.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

    setFormData({
      name: fullName,
      email: profile.email || "",
      room_no: profile.room_no || "",
      contactNumber: profile.contactNumber || "",
    });
    setImagePreview(profile.profileImage || "");
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [profile]);

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const initials =
    [profile?.firstName?.[0], profile?.lastName?.[0]]
      .filter(Boolean)
      .join("")
      .toUpperCase() || "S";

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.room_no.trim()) {
      toast.error("Name and room number are required");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      room_no: formData.room_no.trim(),
    };

    if (formData.email.trim()) {
      payload.email = formData.email.trim();
    }

    if (formData.contactNumber.trim()) {
      payload.contactNumber = formData.contactNumber.trim();
    }

    const result = await dispatch(updateMyProfile(payload));
    if (updateMyProfile.fulfilled.match(result)) {
      dispatch(syncAuthUser(result.payload));
      toast.success("Profile updated successfully");
      return;
    }

    toast.error(result.payload || "Failed to update profile");
  };

  const handleUploadImage = async () => {
    if (!selectedFile) {
      toast.error("Choose an image first");
      return;
    }

    const result = await dispatch(uploadMyProfileImage(selectedFile));
    if (uploadMyProfileImage.fulfilled.match(result)) {
      dispatch(syncAuthUser(result.payload));
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.success("Profile image uploaded successfully");
      return;
    }

    toast.error(result.payload || "Failed to upload image");
  };

  return (
    <div className="min-h-screen gradient-bg p-4 md:p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="glass-card p-6"
        >
          <h1 className="text-2xl md:text-3xl font-bold font-display text-foreground">
            Student Profile
          </h1>
          <p className="text-muted-foreground mt-1">
            View and update your student information
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="glass-card p-6 space-y-5"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="h-28 w-28 border border-border/60 shadow-lg">
                <AvatarImage
                  src={imagePreview || profile?.profileImage || ""}
                  alt="Profile image"
                />
                <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  {[profile?.firstName, profile?.lastName]
                    .filter(Boolean)
                    .join(" ") || "Student"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {profile?.room_no
                    ? `Room ${profile.room_no}`
                    : "Room not set"}
                </p>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl bg-muted/30 p-4 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="break-all">
                  {profile?.email || "No email set"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Hash className="h-4 w-4" />
                <span>{profile?.room_no || "No room number set"}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{profile?.contactNumber || "No contact number set"}</span>
              </div>
            </div>

            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              <Button
                type="button"
                variant="outline"
                className="w-full rounded-xl h-11"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageUp className="mr-2 h-4 w-4" />
                Choose Image
              </Button>

              <Button
                type="button"
                className="w-full rounded-xl h-11 gradient-warm text-primary-foreground border-0"
                onClick={handleUploadImage}
                disabled={profileUploading || !selectedFile}
              >
                <Upload className="mr-2 h-4 w-4" />
                {profileUploading ? "Uploading..." : "Upload Image"}
              </Button>

              {selectedFile ? (
                <p className="text-xs text-muted-foreground break-all">
                  Selected: {selectedFile.name}
                </p>
              ) : null}
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            onSubmit={handleSaveProfile}
            className="glass-card p-6 md:p-8 space-y-5"
          >
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Edit Profile
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Update your name, email, room number, and contact number.
              </p>
            </div>

            {profileError ? (
              <p className="text-sm text-destructive">{profileError}</p>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-foreground">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={formData.name}
                    onChange={handleChange("name")}
                    placeholder="Enter your full name"
                    className="pl-10 h-12 rounded-xl bg-muted/50 border-border/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={formData.email}
                    onChange={handleChange("email")}
                    type="email"
                    placeholder="Email address"
                    className="pl-10 h-12 rounded-xl bg-muted/50 border-border/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Contact Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={formData.contactNumber}
                    onChange={handleChange("contactNumber")}
                    placeholder="Contact number"
                    className="pl-10 h-12 rounded-xl bg-muted/50 border-border/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-foreground">
                  Room Number
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={formData.room_no}
                    onChange={handleChange("room_no")}
                    placeholder="Room number"
                    className="pl-10 h-12 rounded-xl bg-muted/50 border-border/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <Button
                type="submit"
                className="rounded-xl h-11 gradient-warm text-primary-foreground border-0"
                disabled={profileActionLoading || profileLoading}
              >
                <Save className="mr-2 h-4 w-4" />
                {profileActionLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
