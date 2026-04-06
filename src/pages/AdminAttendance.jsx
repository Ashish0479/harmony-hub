import { Fragment, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { CalendarCheck2, CheckCircle2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { fetchStudents } from "@/redux/slices/userSlice";
import { fetchAllRebates } from "@/redux/slices/rebateSlice";
import { formatInputDateValue } from "@/lib/dateFormat";
import {
  getAttendanceByDate,
  markAttendance,
} from "@/redux/slices/attendanceSlice";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

function toDateInputValue(date) {
  return new Date(date).toISOString().split("T")[0];
}

function normalizeDateKey(dateInput) {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

const AdminAttendance = () => {
  const dispatch = useDispatch();
  const students = useSelector((state) => state.user.data.students) || [];
  const studentLoading = useSelector((state) => state.user.loading);
  const attendanceState = useSelector((state) => state.attendance);
  const allRebates = useSelector((state) => state.rebate.data.allRebates) || [];

  const [selectedDate, setSelectedDate] = useState(
    toDateInputValue(new Date()),
  );
  const [formRows, setFormRows] = useState({});

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchAllRebates());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedDate) return;
    dispatch(getAttendanceByDate(selectedDate));
  }, [dispatch, selectedDate]);

  useEffect(() => {
    const map = {};
    for (const row of attendanceState.data || []) {
      const student = row.student || {};
      const studentId = String(student._id || row.studentId || row.student);
      if (!studentId) continue;

      map[studentId] = {
        breakfast: Boolean(row.meals?.breakfast),
        lunch: Boolean(row.meals?.lunch),
        dinner: Boolean(row.meals?.dinner),
        guest: Number(row.guest ?? row.guestCount ?? 0),
        extra: Number(row.extra ?? row.extraCharge ?? 0),
      };
    }
    setFormRows(map);
  }, [attendanceState.data]);

  const groupedStudents = useMemo(() => {
    const groups = {};

    for (const student of students) {
      const roomNumber = student.room_no || "Unassigned";
      if (!groups[roomNumber]) groups[roomNumber] = [];
      groups[roomNumber].push(student);
    }

    return Object.entries(groups)
      .sort(([roomA], [roomB]) => String(roomA).localeCompare(String(roomB)))
      .map(([roomNumber, members]) => ({
        roomNumber,
        students: members.sort((a, b) =>
          `${a.firstName || ""} ${a.lastName || ""}`.localeCompare(
            `${b.firstName || ""} ${b.lastName || ""}`,
          ),
        ),
      }));
  }, [students]);

  const rebateStudentIdSet = useMemo(() => {
    const selectedKey = normalizeDateKey(selectedDate);
    const set = new Set();

    for (const rebate of allRebates) {
      const fromKey = normalizeDateKey(rebate.fromDate);
      const toKey = normalizeDateKey(rebate.toDate);

      if (!selectedKey || !fromKey || !toKey) {
        continue;
      }

      if (selectedKey >= fromKey && selectedKey <= toKey) {
        const studentId = String(
          rebate.studentId?._id || rebate.studentId || rebate.student,
        );
        if (studentId) {
          set.add(studentId);
        }
      }
    }

    return set;
  }, [allRebates, selectedDate]);

  const getRow = (studentId) =>
    formRows[studentId] || {
      breakfast: false,
      lunch: false,
      dinner: false,
      guest: 0,
      extra: 0,
    };

  const setRowValue = (studentId, field, value) => {
    setFormRows((prev) => {
      const existing = getRow(studentId);
      return {
        ...prev,
        [studentId]: {
          ...existing,
          [field]: value,
        },
      };
    });
  };

  const handleSave = async () => {
    const payload = students.map((student) => {
      const studentId = String(student._id);
      const row = getRow(String(student._id));
      const isRebateDay = rebateStudentIdSet.has(studentId);

      return {
        studentId: student._id,
        date: selectedDate,
        meals: {
          breakfast: isRebateDay ? false : Boolean(row.breakfast),
          lunch: isRebateDay ? false : Boolean(row.lunch),
          dinner: isRebateDay ? false : Boolean(row.dinner),
        },
        guest: isRebateDay ? 0 : Number(row.guest || 0),
        extra: isRebateDay ? 0 : Number(row.extra || 0),
      };
    });

    const result = await dispatch(markAttendance(payload));

    if (markAttendance.fulfilled.match(result)) {
      toast.success("Attendance saved successfully");
      dispatch(getAttendanceByDate(selectedDate));
      return;
    }

    toast.error(result.payload || "Failed to save attendance");
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-7xl w-full"
    >
      <motion.div variants={item} className="glass-card p-4 sm:p-5 md:p-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold font-display text-foreground">
              Daily Attendance
            </h1>
            <p className="text-sm text-muted-foreground">
              Mark Breakfast, Lunch, Dinner, Guest, and Extra per student.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Rebate day rows are auto-locked and cannot be marked as present.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            <CalendarCheck2 className="h-4 w-4 text-primary" />
            <Input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="w-full sm:w-[180px]"
            />
            <span className="text-xs text-muted-foreground min-w-[95px] text-right">
              {formatInputDateValue(selectedDate)}
            </span>
            <Button
              onClick={handleSave}
              disabled={attendanceState.saving || students.length === 0}
              className="gradient-warm text-primary-foreground border-0 min-h-11 w-full sm:w-auto"
            >
              <Save className="h-4 w-4 mr-2" />
              {attendanceState.saving ? "Saving..." : "Save Attendance"}
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={item}
        className="glass-card p-3 sm:p-4 md:p-6 overflow-x-auto"
      >
        {studentLoading || attendanceState.loading ? (
          <p className="text-sm text-muted-foreground">Loading data...</p>
        ) : null}
        {attendanceState.error ? (
          <p className="text-sm text-destructive">{attendanceState.error}</p>
        ) : null}

        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-b border-border/50">
              <th className="py-3 pr-3 font-medium">Student Name</th>
              <th className="py-3 pr-3 font-medium">Rebate</th>
              <th className="py-3 pr-3 font-medium">Breakfast</th>
              <th className="py-3 pr-3 font-medium">Lunch</th>
              <th className="py-3 pr-3 font-medium">Dinner</th>
              <th className="py-3 pr-3 font-medium">Guest</th>
              <th className="py-3 pr-3 font-medium">Extra</th>
            </tr>
          </thead>
          <tbody>
            {groupedStudents.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-4 text-muted-foreground">
                  No students found
                </td>
              </tr>
            ) : null}
            {groupedStudents.map((room) => (
              <Fragment key={`room-group-${room.roomNumber}`}>
                <tr key={`room-${room.roomNumber}`}>
                  <td
                    colSpan={7}
                    className="pt-4 pb-2 text-xs uppercase tracking-wider text-primary font-semibold"
                  >
                    Room {room.roomNumber}
                  </td>
                </tr>
                {room.students.map((student) => {
                  const studentId = String(student._id);
                  const row = getRow(studentId);
                  const isRebateDay = rebateStudentIdSet.has(studentId);
                  return (
                    <tr
                      key={studentId}
                      className="border-b border-border/30 last:border-b-0"
                    >
                      <td className="py-3 pr-3">
                        <div className="font-medium text-foreground">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {student.email}
                        </div>
                      </td>
                      <td className="py-3 pr-3">
                        {isRebateDay ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-success bg-success/10 px-2.5 py-1 rounded-full">
                            <CheckCircle2 className="h-3 w-3" /> Yes
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            No
                          </span>
                        )}
                      </td>
                      <td className="py-3 pr-3">
                        <input
                          type="checkbox"
                          checked={Boolean(row.breakfast)}
                          onChange={(event) =>
                            setRowValue(
                              studentId,
                              "breakfast",
                              event.target.checked,
                            )
                          }
                          disabled={isRebateDay}
                          className="h-5 w-5"
                        />
                      </td>
                      <td className="py-3 pr-3">
                        <input
                          type="checkbox"
                          checked={Boolean(row.lunch)}
                          onChange={(event) =>
                            setRowValue(
                              studentId,
                              "lunch",
                              event.target.checked,
                            )
                          }
                          disabled={isRebateDay}
                          className="h-5 w-5"
                        />
                      </td>
                      <td className="py-3 pr-3">
                        <input
                          type="checkbox"
                          checked={Boolean(row.dinner)}
                          onChange={(event) =>
                            setRowValue(
                              studentId,
                              "dinner",
                              event.target.checked,
                            )
                          }
                          disabled={isRebateDay}
                          className="h-5 w-5"
                        />
                      </td>
                      <td className="py-3 pr-3">
                        <Input
                          type="number"
                          min={0}
                          value={isRebateDay ? 0 : row.guest}
                          onChange={(event) =>
                            setRowValue(
                              studentId,
                              "guest",
                              Math.max(0, Number(event.target.value || 0)),
                            )
                          }
                          disabled={isRebateDay}
                          className="w-24"
                        />
                      </td>
                      <td className="py-3 pr-3">
                        <Input
                          type="number"
                          min={0}
                          value={isRebateDay ? 0 : row.extra}
                          onChange={(event) =>
                            setRowValue(
                              studentId,
                              "extra",
                              Math.max(0, Number(event.target.value || 0)),
                            )
                          }
                          disabled={isRebateDay}
                          className="w-24"
                        />
                      </td>
                    </tr>
                  );
                })}
              </Fragment>
            ))}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
};

export default AdminAttendance;
