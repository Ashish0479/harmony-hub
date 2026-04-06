import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Megaphone, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { formatDateTime } from "@/lib/dateFormat";
import {
  createAnnouncement,
  deleteAnnouncement,
  fetchAnnouncements,
} from "@/redux/slices/announcementSlice";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

const Announcements = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.data.role);
  const announcementState = useSelector((state) => state.announcement);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(fetchAnnouncements());
  }, [dispatch]);

  const onCreate = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error("Title and message are required");
      return;
    }

    const result = await dispatch(
      createAnnouncement({
        title: title.trim(),
        message: message.trim(),
      }),
    );

    if (createAnnouncement.fulfilled.match(result)) {
      toast.success("Announcement created");
      setTitle("");
      setMessage("");
      dispatch(fetchAnnouncements());
      return;
    }

    toast.error(result.payload || "Failed to create announcement");
  };

  const onDelete = async (id) => {
    const result = await dispatch(deleteAnnouncement(id));

    if (deleteAnnouncement.fulfilled.match(result)) {
      toast.success("Announcement deleted");
      dispatch(fetchAnnouncements());
      return;
    }

    toast.error(result.payload || "Failed to delete announcement");
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-5xl"
    >
      <motion.div variants={item} className="glass-card p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl gradient-warm flex items-center justify-center">
            <Megaphone className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-foreground">
              Announcements
            </h1>
            <p className="text-sm text-muted-foreground">
              {role === "ADMIN"
                ? "Create and manage notices for students"
                : "Latest notices from hostel administration"}
            </p>
          </div>
        </div>
      </motion.div>

      {role === "ADMIN" ? (
        <motion.div variants={item} className="glass-card p-6 space-y-3">
          <h2 className="text-lg font-semibold font-display text-foreground">
            Create Announcement
          </h2>
          <Input
            placeholder="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <Textarea
            placeholder="Message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={4}
          />
          <Button
            onClick={onCreate}
            disabled={announcementState.actionLoading}
            className="gradient-warm text-primary-foreground border-0"
          >
            {announcementState.actionLoading ? "Publishing..." : "Publish"}
          </Button>
        </motion.div>
      ) : null}

      <motion.div variants={item} className="glass-card p-6">
        <h2 className="text-lg font-semibold font-display text-foreground mb-4">
          Recent Announcements
        </h2>
        {announcementState.loading ? (
          <p className="text-sm text-muted-foreground">
            Loading announcements...
          </p>
        ) : null}
        {announcementState.error ? (
          <p className="text-sm text-destructive">{announcementState.error}</p>
        ) : null}

        <div className="space-y-3">
          {(announcementState.data.list || []).length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No announcements yet
            </p>
          ) : null}
          {(announcementState.data.list || []).map((announcement) => (
            <div key={announcement._id} className="bg-muted/30 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {announcement.title}
                  </h3>
                  <p className="text-sm text-foreground mt-1 leading-relaxed">
                    {announcement.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Posted on {formatDateTime(announcement.createdAt)}
                  </p>
                </div>
                {role === "ADMIN" ? (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => onDelete(announcement._id)}
                    aria-label="Delete announcement"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Announcements;
